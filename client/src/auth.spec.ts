import { Crypto } from 'node-webcrypto-ossl'
import * as auth from './auth'

global.crypto = new Crypto()

describe('secret key encryption for local storage', () => {
    it('produces output that matches the input', async () => {
        const key = 'A1-ABCDEFGHJKLMNPQRSTUVWXYZ23'
        const password = 'terrible password'
        const username = 'MmeTestUser'
        const enc = await auth.encryptSecretKey(key, username, password)
        const dec = await auth.decryptSecretKey(enc, username, password)
        expect(dec).toEqual(key)
    })
})
