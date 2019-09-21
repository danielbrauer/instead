import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import path from 'path'
import authManager from './auth-strategies'
import accessControlHeaders from './access-control-headers'
import config from './config'
import forceHttps from './force-https'

const app = express()
app.use(cors())
app.use(accessControlHeaders)
app.use(forceHttps)
app.use(helmet())

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(morgan('dev'))

import auth from './routes/auth'
app.use('/auth', auth)

import api from './routes/api'
app.use('/api', authManager.authenticateBearer, api)

if (!config.localDev) {
    // Statically host React app
    app.use(express.static(path.join(__dirname, '/../client/build')))
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname + '/../client/build/index.html'))
    })
}

app.listen(config.webPort, () => console.log(`Server listening on ${config.webPort}`))