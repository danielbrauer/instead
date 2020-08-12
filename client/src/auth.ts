import scrypt, { ScryptOptions } from 'scrypt-async-modern'
import srp from 'secure-remote-password/client'
import { LoginInfo } from './Interfaces'
import { startLogin, finishLogin, finishSignup, cancelAuth } from './RoutesUnauthenticated'
import { NewUserInfo } from "./Interfaces"
import { startSignup } from "./RoutesUnauthenticated"
import { pwnedPassword } from 'hibp'
const toBuffer = require('typedarray-to-buffer') as (x: Uint8Array) => Buffer
const hkdf = require('futoin-hkdf') as (ikm: string, length: number, { salt, info, hash} : {salt : string, info: string, hash : string}) => Buffer
const xor = require('buffer-xor') as (a: Buffer, b: Buffer) => Buffer
const Crypto = window.crypto
const RSAOAEP_SHA256 : RsaHashedImportParams = { name: 'RSA-OAEP', hash: 'SHA-256' }

async function derivePrivateKey(salt : string, password : string, secretKey : string, username : string) {
    const scryptOptions : ScryptOptions = {
        N: 16384,
        r: 8,
        p: 1,
        dkLen: 32,
        encoding: 'binary'
    }
    const keyParts = secretKey.split('-')
    const version = keyParts.shift()!
    const key = keyParts.shift()!

    const passwordBuffer = Buffer.from(password.trim().normalize('NFKC'))

    const saltedSalt = hkdf(salt, 32, {salt: username, info: version, hash: 'SHA-256'})
    const hashedPassword = toBuffer(await scrypt(passwordBuffer, saltedSalt, scryptOptions))
    const saltedKey = hkdf(key, 32, {salt: username, info: version, hash: 'SHA-256'})

    return xor(hashedPassword, saltedKey).toString('hex')
}

async function importMukFromHex(keyAsHex: string) {
    return await Crypto.subtle.importKey(
        'raw',
        Buffer.from(keyAsHex, 'hex'),
        { name: 'AES-GCM'},
        false,
        ['wrapKey', 'unwrapKey']
    )
}

async function importExtractableRsaKeyFromJwk(jwk: JsonWebKey, usages: KeyUsage[]) {
    return Crypto.subtle.importKey(
        'jwk',
        jwk,
        RSAOAEP_SHA256,
        true,
        usages
    )
}

export async function importAccountKeysFromJwks(jwks: {privateKey: JsonWebKey, publicKey: JsonWebKey}) {
    const [privateKey, publicKey] = await Promise.all([
        importExtractableRsaKeyFromJwk(jwks.privateKey, ['decrypt', 'unwrapKey']),
        importExtractableRsaKeyFromJwk(jwks.publicKey, ['encrypt', 'wrapKey'])
    ])
    return { privateKey, publicKey }
}

export async function exportAccountKeysToJwks(keys: CryptoKeyPair) {
    const [privateKey, publicKey] = await Promise.all([
        Crypto.subtle.exportKey('jwk', keys.privateKey),
        Crypto.subtle.exportKey('jwk', keys.publicKey)
    ])
    return { privateKey, publicKey }
}

export async function login(info : LoginInfo) {
    console.log('logging in')
    const clientEphemeral = srp.generateEphemeral()
    const startResponse = await startLogin(info.username, clientEphemeral.public)
    const { srpSalt, serverEphemeralPublic } = startResponse
    const srpKey = await derivePrivateKey(srpSalt, info.password, info.secretKey, info.username)
    const clientSession = srp.deriveSession(clientEphemeral.secret, serverEphemeralPublic, srpSalt, info.username, srpKey)
    const userInfo = await finishLogin(clientSession.proof)
    const { serverSessionProof, userid, displayName, privateKey: privateKeyEnc, privateKeyIv, publicKey: publicKeyJwk, mukSalt } = userInfo
    srp.verifySession(clientEphemeral.public, clientSession, serverSessionProof)

    const mukHex = await derivePrivateKey(mukSalt, info.password, info.secretKey, info.username)
    const muk = await importMukFromHex(mukHex)
    const privateKey = await Crypto.subtle.unwrapKey(
        'jwk',
        Buffer.from(privateKeyEnc, 'base64'),
        muk,
        { name: 'AES-GCM', iv: Buffer.from(privateKeyIv, 'base64') },
        RSAOAEP_SHA256,
        true,
        ['decrypt', 'unwrapKey']
    )
    const publicKey = await importExtractableRsaKeyFromJwk(publicKeyJwk, ['encrypt', 'wrapKey'])
    const accountKeys = {
        privateKey,
        publicKey,
    }
    return {
        id: userid,
        username: info.username,
        displayName,
        secretKey: info.secretKey,
        accountKeys
    }
}

function createSecretKey() {
    const characters = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
    const values = Crypto.getRandomValues(new Uint8Array(26))
    let output = ''
    values.forEach(x => output += characters.charAt(x%32))
    return 'A1-' + output
}

export async function signup(info : NewUserInfo) {
    console.log('creating user')
    const { username } = await startSignup()

    const srpSalt = toBuffer(Crypto.getRandomValues(new Uint8Array(16))).toString('hex')
    const secretKey = createSecretKey()
    const srpKey = await derivePrivateKey(srpSalt, info.password, secretKey, username)
    const verifier = srp.deriveVerifier(srpKey)

    const mukSalt = toBuffer(Crypto.getRandomValues(new Uint8Array(16))).toString('hex')
    const mukHex = await derivePrivateKey(mukSalt, info.password, secretKey, username)
    const muk = await importMukFromHex(mukHex)
    const keyParams: RsaHashedKeyGenParams = {
        ...RSAOAEP_SHA256,
        modulusLength: 4096,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
    }
    const accountKeys = await Crypto.subtle.generateKey(
        keyParams,
        true,
        ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey']
    ) as CryptoKeyPair
    const exportedPublic = await Crypto.subtle.exportKey('jwk', accountKeys.publicKey)
    const accountPrivateIv = Crypto.getRandomValues(new Uint8Array(12))
    const wrappedPrivate = await Crypto.subtle.wrapKey(
        'jwk',
        accountKeys.privateKey,
        muk,
        { name: 'AES-GCM', iv: accountPrivateIv}
    )
    const { user: {id: userid} } = await finishSignup(
        info.displayName,
        srpSalt,
        verifier,
        mukSalt,
        exportedPublic,
        Buffer.from(wrappedPrivate).toString('base64'),
        Buffer.from(accountPrivateIv).toString('base64')
    )
    return {
        id: userid,
        username,
        secretKey,
        displayName: info.displayName,
        accountKeys
    }
}

export async function passwordCheck(password: string) {
    const breachCount = await pwnedPassword(password)
    if (breachCount > 0)
        throw new Error('This password is well-known, and you can\'t use it here. If it is your password, you should change it.')
}

export async function cancel() {
    await cancelAuth()
}