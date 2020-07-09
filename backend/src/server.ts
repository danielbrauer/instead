import "reflect-metadata"
import express from 'express'
import cors from './middleware/cors'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import authManager from './middleware/auth-strategies'
import config from './config/config'
import forceHttps from './middleware/force-https'
import session from './middleware/session'
import auth from './routes/auth'
import api from './routes/api'
import { forwardErrors } from './middleware/errors'
import path from 'path'
import httpServer from './middleware/http-server'

const app = express()
app.use(forceHttps)
app.use(helmet())
app.use(cors)
if (!config.localDev)
    app.set('trust proxy', 1) // trust first proxy
app.use(session)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan('dev'))

app.use('/auth', auth)
app.use('/api', authManager.authenticateSession, api, forwardErrors)

if (!config.localDev) {
    const relativePathToReact = '/../../client/build'
    const reactPath = path.join(__dirname, relativePathToReact)
    httpServer(app, reactPath)
}

app.listen(config.webPort, () => console.log(`Server listening on ${config.webPort}`))