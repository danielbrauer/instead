import { Express } from 'express'
import path from 'path'
import expressStaticGzip from 'express-static-gzip'

export default (app : Express) => {
    // Statically host React app
    const relativePathToReact = '/../../client/build'
    const server = expressStaticGzip(
        path.join(__dirname, relativePathToReact),
        {
            enableBrotli: true,
        }
    )
    app.use(server)
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, relativePathToReact, '/index.html'))
    })
}