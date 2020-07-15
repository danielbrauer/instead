import scrypt, { ScryptOptions } from 'scrypt-async-modern'
import srp from 'secure-remote-password/client'
import { LoginInfo, CurrentUserInfo } from './Interfaces'
import { startLogin, finishLogin, finishSignup } from './RoutesUnauthenticated'
import { NewUserInfo } from "./Interfaces"
import { startSignup } from "./RoutesUnauthenticated"
import { pwnedPassword } from 'hibp'
const toBuffer = require('typedarray-to-buffer') as (x: Uint8Array) => Buffer
const hkdf = require('futoin-hkdf') as (ikm: string, length: number, { salt, info, hash} : {salt : string, info: string, hash : string}) => Buffer
const xor = require('buffer-xor') as (a: Buffer, b: Buffer) => Buffer
const Crypto = window.crypto

const derivePrivateKey = async (salt : string, password : string, secretKey : string, username : string) => {
    const scryptOptions : ScryptOptions = {
        N: 16384,
        r: 8,
        p: 1,
        dkLen: 32,
        encoding: 'binary'
    }
    const keyParts = secretKey.split('-')
    const version = keyParts.shift()!
    const key = keyParts.join()

    const passwordBuffer = Buffer.from(password.trim().normalize('NFKC'))

    const saltedSalt = hkdf(salt, 32, {salt: username, info: version, hash: 'SHA-256'})
    const hashedPassword = toBuffer(await scrypt(passwordBuffer, saltedSalt, scryptOptions))
    const saltedKey = hkdf(key, 32, {salt: username, info: version, hash: 'SHA-256'})

    return xor(hashedPassword, saltedKey).toString('hex')
}

const importKeyFromHex = async (keyAsHex: string) => {
    return await Crypto.subtle.importKey(
        'raw',
        Buffer.from(keyAsHex, 'hex'),
        { name: 'AES-GCM'},
        false,
        ["encrypt", "decrypt", 'wrapKey', 'unwrapKey']
    )
}

export const login = async(info : LoginInfo) => {
    console.log('logging in')
    const clientEphemeral = srp.generateEphemeral()
    const startResponse = await startLogin(info.username, clientEphemeral.public)
    const { srpSalt, serverEphemeralPublic } = startResponse
    const srpKey = await derivePrivateKey(srpSalt, info.password, info.secretKey, info.username)
    const clientSession = srp.deriveSession(clientEphemeral.secret, serverEphemeralPublic, srpSalt, info.username, srpKey)
    const userInfo = await finishLogin(clientSession.proof)
    const { serverSessionProof, userid, displayName, privateKey: privateKeyEnc, publicKey, mukSalt } = userInfo
    srp.verifySession(clientEphemeral.public, clientSession, serverSessionProof)

    const mukHex = await derivePrivateKey(mukSalt, info.password, info.secretKey, info.username)
    const muk = await importKeyFromHex(mukHex)
    const privateKey = await Crypto.subtle.unwrapKey(
        'jwk',
        Buffer.from(privateKeyEnc, 'base64'),
        muk,
        { name: 'AES-KW'},
        'AES-GCM',
        false,
        ['decrypt']
    )
    const importedPublicKey = await Crypto.subtle.importKey(
        'jwk',
        publicKey,
        { name: 'AES-GCM'},
        false,
        ['encrypt']
    )
    const accountKeys = new CryptoKeyPair()
    accountKeys.privateKey = privateKey
    accountKeys.publicKey = importedPublicKey
    return { id: userid, username: info.username, displayName, secretKey: info.secretKey, accountKeys }
}

const createSecretKey = () => {
    const characters = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
    const values = Crypto.getRandomValues(new Uint8Array(26))
    let output = ''
    values.forEach(x => output += characters.charAt(x%32))
    return 'A1-' + output
}

export const signup = async(info : NewUserInfo) => {
    console.log('creating user')
    const { username } = await startSignup()

    const srpSalt = toBuffer(Crypto.getRandomValues(new Uint8Array(16))).toString('hex')
    const secretKey = createSecretKey()
    const srpKey = await derivePrivateKey(srpSalt, info.password, secretKey, username)
    const verifier = srp.deriveVerifier(srpKey)

    const mukSalt = toBuffer(Crypto.getRandomValues(new Uint8Array(16))).toString('hex')
    const mukHex = await derivePrivateKey(mukSalt, info.password, secretKey, username)
    const muk = await importKeyFromHex(mukHex)
    const keyParams: RsaHashedKeyGenParams = {
        name: 'RSA-OAEP',
        modulusLength: 4096,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: 'SHA-256',
    }
    const accountKeys = await Crypto.subtle.generateKey(
        keyParams,
        true,
        ["encrypt", "decrypt"]
    ) as CryptoKeyPair
    const exportedPublic = await Crypto.subtle.exportKey(
        'jwk',
        accountKeys.publicKey
    )
    const wrappedPrivate = await Crypto.subtle.wrapKey(
        'jwk',
        accountKeys.privateKey,
        muk,
        { name: 'AES-KW' }
    )
    const { user: {id: userid} } = await finishSignup(
        info.displayName,
        srpSalt,
        verifier,
        mukSalt,
        exportedPublic,
        Buffer.from(wrappedPrivate).toString('base64'),
    )
    return {
        id: userid,
        username,
        secretKey,
        displayName: info.displayName,
        accountKeys,
    }
}

export const passwordCheck = async(password: string) => {
    const breachCount = await pwnedPassword(password)
    if (breachCount > 0)
        throw new Error('This password is well-known, and you can\'t use it here. If it is your password, you should change it.')
}