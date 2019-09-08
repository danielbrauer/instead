const denodeify = require('es6-denodeify')()
const crypto = require('crypto')

const cryptoPromise = {}

cryptoPromise.scrypt = denodeify(crypto.scrypt)
cryptoPromise.randomBytes = denodeify(crypto.randomBytes)

module.exports = cryptoPromise