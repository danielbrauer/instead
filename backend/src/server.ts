import 'reflect-metadata'
import express from 'express'
import cors from './middleware/cors'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import authManager from './middleware/auth-strategies'
import * as config from './config/config'
import forceHttps from './middleware/force-https'
import session from './middleware/session'
import apiHeaders from './middleware/api-headers'
import auth from './routes/auth'
import api from './routes/api'
import { forwardErrors } from './middleware/errors'
import path from 'path'

const app = express()
app.use(forceHttps)
app.use(helmet())
app.use(cors)
if (!config.isLocalDev()) app.set('trust proxy', 1) // trust first proxy
app.use(session)

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan('dev'))

app.use('/auth', apiHeaders, auth)
app.use('/api', apiHeaders, authManager.authenticateSession, api, forwardErrors)

if (!config.isLocalDev()) {
    const relativePathToReact = '/../../../client/build'
    const reactPath = path.join(__dirname, relativePathToReact)

    app.use(express.static(path.join(__dirname, relativePathToReact)))
    app.get('*', (req, res) => {
        res.sendFile(path.join(reactPath, '/index.html'))
    })
}

const port = config.int('PORT')
app.listen(port, () => console.log(`Server listening on ${port}`))
