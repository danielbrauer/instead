import jwt from 'jsonwebtoken'
import util from 'util'

export default class PromiseJwt {
    static sign: (payload: string | object | Buffer, secretOrPrivateKey: jwt.Secret, options?: jwt.SignOptions) => Promise<string> = util.promisify(jwt.sign)
    static verify: (token: string, secretOrPublicKey: string | Buffer, options?: jwt.VerifyOptions) => Promise<string | object> = util.promisify(jwt.verify)
}
