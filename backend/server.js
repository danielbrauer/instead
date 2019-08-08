import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import authManager from './auth-strategies'

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

import auth from './routes/auth'
app.use('/auth', auth)

import api from './routes/api'
app.use('/api', authManager.authenticateBearer, api)

// launch our backend into a port
app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`))
