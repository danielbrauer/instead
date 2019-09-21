import crypto from 'crypto'
import util from 'util'

export default class PromiseCrypto {
    static check = util.promisify(crypto.randomBytes)
    static scrypt: (password: crypto.BinaryLike, salt: crypto.BinaryLike, keylen: number) => Promise<Buffer> = util.promisify(crypto.scrypt)
    static randomBytes: (size: number) => Promise<Buffer> = util.promisify(crypto.randomBytes)
}
