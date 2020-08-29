import Crypto from './crypto-promise'

export default async function createSecureUnambiguousString(length: number) {
    const characters = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
    const values = await Crypto.randomBytes(length)
    let output = ''
    values.forEach((x) => (output += characters.charAt(x % 32)))
    return output
}
