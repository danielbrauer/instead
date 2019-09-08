const denodeify = require('es6-denodeify')()
const jwt = require('jsonwebtoken')

const jwtPromise = {}

jwtPromise.verify = denodeify(jwt.verify)
jwtPromise.sign = denodeify(jwt.sign)

module.exports = jwtPromise