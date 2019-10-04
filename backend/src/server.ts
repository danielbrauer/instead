import express from 'express'
import cors from './middleware/cors'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import path from 'path'
import authManager from './middleware/auth-strategies'
import config from './config/config'
import forceHttps from './middleware/force-https'
import session from './middleware/session'
import auth from './routes/auth'
import api from './routes/api'

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
app.use('/api', authManager.authenticateSession, api)

if (!config.localDev) {
    // Statically host React app
    const relativePathToReact = '/../../client/build'
    app.use(express.static(path.join(__dirname, relativePathToReact)))

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, relativePathToReact, '/index.html'))
    })
}

app.listen(config.webPort, () => console.log(`Server listening on ${config.webPort}`))