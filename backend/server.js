const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const helmet = require('helmet')
const passport = require('passport')

const API_PORT = 3001
const app = express()
app.use(cors())
app.use(helmet())

require('./database')

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan('dev'))

app.use(passport.initialize())
require('./passport-strategies')

const auth = require('./routes/auth')
app.use('/auth', auth)
const user = require('./routes/user')
app.use('/user', passport.authenticate('jwt', {session: false}), user)

const api = require('./routes/api')
app.use('/api', api)

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`))
