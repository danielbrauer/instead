import bodyParser from 'body-parser'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import 'reflect-metadata'
import config from './config/config'
import apiHeaders from './middleware/api-headers'
import authenticateSession from './middleware/authenticate-session'
import cors from './middleware/cors'
import forwardErrors from './middleware/errors'
import forceHttps from './middleware/force-https'
import session from './middleware/session'
import api from './routes/api'
import auth from './routes/auth'
import signup from './routes/signup'

const app = express()
app.use(forceHttps)
app.use(helmet())
app.use(cors)
if (!config.isLocalDev()) app.set('trust proxy', 1) // trust first proxy

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan('dev'))

app.use(apiHeaders)
app.use('/signup', signup, forwardErrors)
app.use('/auth', session, auth)
app.use('/api', session, authenticateSession, api, forwardErrors)

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
