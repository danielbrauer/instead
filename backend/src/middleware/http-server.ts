import { Express } from 'express'
import path from 'path'
import expressStaticGzip from 'express-static-gzip'

export default (app: Express, reactPath: string) => {
    // Statically host React app
    const server = expressStaticGzip(
        reactPath,
        {
            enableBrotli: true,
            orderPreference: ['br']
        }
    )
    app.use(server)
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(reactPath, '/index.html'))
    })
}