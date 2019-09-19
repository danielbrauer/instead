const { Pool } = require('pg')
const config = require('./config')

const pool = (config.databaseUrl === undefined) ? new Pool() : new Pool({connectionString: config.databaseUrl})

function PromiseClient(client) {
    this.client = client
}

PromiseClient.prototype.query = function(text, params) {
    return this.client.query(text, params)
}

PromiseClient.prototype.queryOne = async function(text, params) {
    const { rows: [one = null] } = await this.client.query(text, params)
    return one
}

PromiseClient.prototype.count = async function(text, params) {
    const { rows: [{ count }] } = await this.client.query(text, params)
    return count
}

module.exports = new PromiseClient(pool)

module.exports.transaction = async (commands) => {
    const client = await pool.connect()
    let result = null
    try {
        await client.query('BEGIN')
        result = await commands(new PromiseClient(client))
        await client.query('COMMIT')
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    } finally {
        client.release()
    }
    return result
}