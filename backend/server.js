const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const helmet = require('helmet')
const authManager = require('./auth-strategies')
const accessControlHeaders = require('./access-control-headers')

const API_PORT = 8081
const app = express()
app.use(cors())
app.use(accessControlHeaders)
app.use(helmet())

require('./database')

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan('dev'))

const auth = require('./routes/auth')
app.use('/auth', auth)

const api = require('./routes/api')
app.use('/api', authManager.authenticateBearer, api)

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`))
