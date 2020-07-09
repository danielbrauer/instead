import scrypt, { ScryptOptions } from 'scrypt-async-modern'
import srp from 'secure-remote-password/client'
import { LoginInfo } from './Interfaces'
import { startLogin, finishLogin, finishSignup } from './RoutesUnauthenticated'
import { NewUserInfo } from "./Interfaces"
import { startSignup } from "./RoutesUnauthenticated"
const toBuffer = require('typedarray-to-buffer') as (x: any) => Buffer
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

export const login = async(info : LoginInfo) => {
    console.log('logging in')
    const clientEphemeral = srp.generateEphemeral()
    const startResponse = await startLogin(info.username, clientEphemeral.public)
    const { srpSalt, serverEphemeralPublic } = startResponse
    const srpKey = await derivePrivateKey(srpSalt, info.password, info.secretKey, info.username)
    const clientSession = srp.deriveSession(clientEphemeral.secret, serverEphemeralPublic, srpSalt, info.username, srpKey)
    const finishResponse = await finishLogin(clientSession.proof)
    const { serverSessionProof, userid, displayName } = finishResponse
    srp.verifySession(clientEphemeral.public, clientSession, serverSessionProof)
    return { userid, displayName }
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
    const muk = await derivePrivateKey(mukSalt, info.password, secretKey, username)
    // @ts-ignore
    const mukJwk = await Crypto.subtle.importKey(
        'raw',
        Buffer.from(muk, 'hex'),
        // @ts-ignore
        { name: 'AES-GCM'},
        false,
        ["encrypt", "decrypt", 'wrapKey', 'unwrapKey']
    )
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
    const accountPrivateIv = Crypto.getRandomValues(new Uint8Array(12))
    const wrappedPrivate = await Crypto.subtle.wrapKey(
        'jwk',
        accountKeys.privateKey,
        mukJwk,
        // @ts-ignore
        { name: 'AES-GCM', iv: accountPrivateIv}
    )
    const {id: userid} = await finishSignup(info.displayName, srpSalt, verifier, mukSalt, exportedPublic, Buffer.from(wrappedPrivate).toString('hex'), Buffer.from(accountPrivateIv).toString('hex'))
    return {userid, username, secretKey}
}