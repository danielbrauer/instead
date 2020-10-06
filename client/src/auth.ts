import { pwnedPassword } from 'hibp'
import scrypt, { ScryptOptions } from 'scrypt-async-modern'
import srp from 'secure-remote-password/client'
import { Json } from '../../backend/src/queries/users-auth.gen'
import { EncryptedSecretKey, LoginInfo, NewUserInfo, SignupResult } from './Interfaces'
import * as Auth from './routes/auth'
import * as Signup from './routes/signup'
const toBuffer = require('typedarray-to-buffer') as (x: Uint8Array) => Buffer
const hkdf = require('futoin-hkdf') as (
    ikm: string,
    length: number,
    { salt, info, hash }: { salt: string; info: string; hash: string },
) => Buffer
const xor = require('buffer-xor') as (a: Buffer, b: Buffer) => Buffer
const RSAOAEP_SHA256: RsaHashedImportParams = { name: 'RSA-OAEP', hash: 'SHA-256' }

async function derivePrivateKey(salt: string, password: string, secretKey: string, username: string) {
    const scryptOptions: ScryptOptions = {
        N: 16384,
        r: 8,
        p: 1,
        dkLen: 32,
        encoding: 'binary',
    }
    const keyParts = secretKey.split(versionSeparator)
    const version = keyParts.shift()!
    const key = keyParts.shift()!

    const passwordBuffer = Buffer.from(password.trim().normalize('NFKC'))

    const saltedSalt = hkdf(salt, 32, { salt: username, info: version, hash: 'SHA-256' })
    const hashedPassword = toBuffer(await scrypt(passwordBuffer, saltedSalt, scryptOptions))
    const saltedKey = hkdf(key, 32, { salt: username, info: version, hash: 'SHA-256' })

    return xor(hashedPassword, saltedKey).toString('hex')
}

async function importMukFromHex(keyAsHex: string) {
    return await window.crypto.subtle.importKey('raw', Buffer.from(keyAsHex, 'hex'), { name: 'AES-GCM' }, false, [
        'wrapKey',
        'unwrapKey',
    ])
}

async function importExtractableRsaKeyFromJwk(jwk: JsonWebKey, usages: KeyUsage[]) {
    return window.crypto.subtle.importKey('jwk', jwk, RSAOAEP_SHA256, true, usages)
}

export async function importAccountKeysFromJwks(jwks: { privateKey: JsonWebKey; publicKey: JsonWebKey }) {
    const [privateKey, publicKey] = await Promise.all([
        importExtractableRsaKeyFromJwk(jwks.privateKey, ['decrypt', 'unwrapKey']),
        importExtractableRsaKeyFromJwk(jwks.publicKey, ['encrypt', 'wrapKey']),
    ])
    return { privateKey, publicKey }
}

export async function exportAccountKeysToJwks(keys: CryptoKeyPair) {
    const [privateKey, publicKey] = await Promise.all([
        window.crypto.subtle.exportKey('jwk', keys.privateKey),
        window.crypto.subtle.exportKey('jwk', keys.publicKey),
    ])
    return { privateKey, publicKey }
}

export interface LoginResult {
    id: number
    username: string
    encryptedSecretKey: EncryptedSecretKey
    accountKeys: CryptoKeyPair
}

export async function loginWithPlainOrEncryptedSecretKey(info: {
    username: string
    password: string
    secretKey: string | null
    encryptedSecretKey: EncryptedSecretKey | null
}): Promise<LoginResult> {
    const secretKey = info.secretKey || (await decryptSecretKey(info.encryptedSecretKey!, info.username, info.password))
    const loginInfo = await login({
        username: info.username,
        password: info.password,
        secretKey,
    })
    const encryptedSecretKey =
        info.encryptedSecretKey || (await encryptSecretKey(info.secretKey!, info.username, info.password))
    return {
        encryptedSecretKey,
        ...loginInfo,
    }
}

async function login(info: LoginInfo) {
    console.log('logging in')
    const clientEphemeral = srp.generateEphemeral()
    const startResponse = await Auth.startLogin(info.username, clientEphemeral.public)
    const { srpSalt, serverEphemeralPublic } = startResponse
    const srpKey = await derivePrivateKey(srpSalt, info.password, info.secretKey, info.username)
    const clientSession = srp.deriveSession(
        clientEphemeral.secret,
        serverEphemeralPublic,
        srpSalt,
        info.username,
        srpKey,
    )
    const {
        serverSessionProof,
        userId,
        privateKey: privateKeyEnc,
        privateKeyIv,
        publicKey: publicKeyJwk,
        mukSalt,
    } = await Auth.finishLogin(clientSession.proof)
    srp.verifySession(clientEphemeral.public, clientSession, serverSessionProof)

    const mukHex = await derivePrivateKey(mukSalt, info.password, info.secretKey, info.username)
    const muk = await importMukFromHex(mukHex)
    const privateKey = await window.crypto.subtle.unwrapKey(
        'jwk',
        Buffer.from(privateKeyEnc, 'base64'),
        muk,
        { name: 'AES-GCM', iv: Buffer.from(privateKeyIv, 'base64') },
        RSAOAEP_SHA256,
        true,
        ['decrypt', 'unwrapKey'],
    )
    const publicKey = await importExtractableRsaKeyFromJwk(publicKeyJwk, ['encrypt', 'wrapKey'])
    const accountKeys = {
        privateKey,
        publicKey,
    }
    return {
        id: userId,
        username: info.username,
        accountKeys,
    }
}

const unambiguousCharacters = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
const versionString = 'A1'
const versionSeparator = '-'
const plaintextPrefix = 2

export function createSecureUnambiguousString(length: number) {
    const values = window.crypto.getRandomValues(new Uint8Array(length))
    let output = ''
    values.forEach((x) => (output += unambiguousCharacters.charAt(x % 32)))
    return output
}

async function simplePasswordKey(version: string, username: string, password: string) {
    const options = {
        salt: username,
        info: version,
        hash: 'SHA-256',
    }
    const key = hkdf(password.trim().normalize('NFKC'), 32, options)
    return await window.crypto.subtle.importKey('raw', key, { name: 'AES-CTR' }, false, ['encrypt', 'decrypt'])
}

export async function encryptSecretKey(key: string, username: string, password: string): Promise<EncryptedSecretKey> {
    const keyParts = key.split(versionSeparator)
    const version = keyParts.shift()!
    const keyPart = keyParts.shift()!
    const prefix = version + versionSeparator + keyPart.substr(0, plaintextPrefix)
    const remainder = keyPart.substr(plaintextPrefix)
    let bits = ''

    for (var i = 0; i < remainder.length; ++i) {
        const binary = unambiguousCharacters.indexOf(remainder.charAt(i)).toString(2)
        bits += binary.padStart(5, '0')
    }

    const bytes = new Uint8Array((24 * 5) / 8)

    for (var i = 0; i < bits.length; ++i) {
        bytes[i] = parseInt(bits.substr(i * 8, 8), 2)
    }

    const counter = window.crypto.getRandomValues(new Uint8Array(16))

    const passwordKey = await simplePasswordKey(versionString, username, password)

    const encrypted = await window.crypto.subtle.encrypt({ name: 'AES-CTR', counter, length: 64 }, passwordKey, bytes)

    return {
        encrypted: Buffer.from(encrypted).toString('base64'),
        counter: Buffer.from(counter).toString('base64'),
        prefix,
    }
}

export async function decryptSecretKey(encrypted: EncryptedSecretKey, username: string, password: string) {
    const passwordKey = await simplePasswordKey(versionString, username, password)

    const byteBuffer = await window.crypto.subtle.decrypt(
        { name: 'AES-CTR', counter: Buffer.from(encrypted.counter, 'base64'), length: 64 },
        passwordKey,
        Buffer.from(encrypted.encrypted, 'base64'),
    )

    const bytes = new Uint8Array(byteBuffer)
    let bits = ''
    for (var i = 0; i < bytes.length; ++i) {
        bits += bytes[i].toString(2).padStart(8, '0')
    }

    let decrypted = ''
    for (var i = 0; i < bits.length; i += 5) {
        const index = parseInt(bits.substr(i, 5), 2)
        decrypted += unambiguousCharacters.charAt(index)
    }

    return encrypted.prefix + decrypted
}

function createSecretKey() {
    const output = createSecureUnambiguousString(26)
    return versionString + versionSeparator + output
}

export async function signup(info: NewUserInfo): Promise<SignupResult> {
    console.log('creating user')

    const srpSalt = toBuffer(window.crypto.getRandomValues(new Uint8Array(16))).toString('hex')
    const secretKey = createSecretKey()
    const srpKey = await derivePrivateKey(srpSalt, info.password, secretKey, info.username)
    const verifier = srp.deriveVerifier(srpKey)

    const mukSalt = toBuffer(window.crypto.getRandomValues(new Uint8Array(16))).toString('hex')
    const mukHex = await derivePrivateKey(mukSalt, info.password, secretKey, info.username)
    const muk = await importMukFromHex(mukHex)
    const keyParams: RsaHashedKeyGenParams = {
        ...RSAOAEP_SHA256,
        modulusLength: 4096,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
    }
    const accountKeys = (await window.crypto.subtle.generateKey(keyParams, true, [
        'encrypt',
        'decrypt',
        'wrapKey',
        'unwrapKey',
    ])) as CryptoKeyPair
    const exportedPublic = await window.crypto.subtle.exportKey('jwk', accountKeys.publicKey)
    const accountPrivateIv = window.crypto.getRandomValues(new Uint8Array(12))
    const wrappedPrivate = await window.crypto.subtle.wrapKey('jwk', accountKeys.privateKey, muk, {
        name: 'AES-GCM',
        iv: accountPrivateIv,
    })

    await Signup.signup({
        username: info.username,
        srpSalt,
        verifier,
        mukSalt,
        publicKey: exportedPublic as Json,
        privateKey: Buffer.from(wrappedPrivate).toString('base64'),
        privateKeyIv: Buffer.from(accountPrivateIv).toString('base64'),
    })
    const encryptedSecretKey = await encryptSecretKey(secretKey, info.username, info.password)
    return {
        encryptedSecretKey,
        unencryptedSecretKey: secretKey,
    }
}

export async function passwordCheck(password: string) {
    const breachCount = await pwnedPassword(password)
    if (breachCount > 0)
        throw new Error(
            "This password is well-known, and you can't use it here. If it is your password, you should change it.",
        )
}

export async function cancel() {
    await Auth.cancelAuth()
}
