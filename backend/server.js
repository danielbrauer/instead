const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const helmet = require('helmet')
const path = require('path')
const authManager = require('./auth-strategies')
const accessControlHeaders = require('./access-control-headers')
const config = require('./config')
const forceHttps = require('./force-https')

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

const auth = require('./routes/auth')
app.use('/auth', auth)

const api = require('./routes/api')
app.use('/api', authManager.authenticateBearer, api)

if (!config.localDev) {
    // Statically host React app
    app.use(express.static(path.join(__dirname, "/../client/build")))
    
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname + "/../client/build/index.html"))
    })
}

app.listen(config.webPort, () => console.log(`Server listening on ${config.webPort}`))