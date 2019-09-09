const crypto = require('crypto')
const { promisify } = require('util')

const cryptoPromise = {}

cryptoPromise.scrypt = promisify(crypto.scrypt)
cryptoPromise.randomBytes = promisify(crypto.randomBytes)

module.exports = cryptoPromise