const config = require('./config')

module.exports = function requireHTTPS(req, res, next) {
    // The 'x-forwarded-proto' check is for Heroku
    if (!config.localDev && !req.secure && req.get('x-forwarded-proto') !== 'https') {
        if (req.method === 'GET') {
            return res.redirect('https://' + req.get('host') + req.url)
        } else {
            return res.status(403).send('HTTPS only')
        }
    }
    next()
}