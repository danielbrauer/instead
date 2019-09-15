const { Pool } = require('pg')
const config = require('config')

const dbConfig = config.get('Customer.postgres')
const user = dbConfig.get('user')
const host = dbConfig.get('host')
const database = dbConfig.get('database')
const password = dbConfig.get('password')
const port = parseInt(dbConfig.get('port'), 10)

const pool = new Pool({
    user: user,
    host: host,
    database: database,
    password: password,
    port: port,
})

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

module.exports = {
    query: (text, params) => pool.query(text, params),
    queryOne: async (text, params) => {
        const { rows: [one = null] } = await pool.query(text, params)
        return one
    },
    count: async (text, params) => {
        const { rows: [{ count }] } = await pool.query(text, params)
        return count
    },
    transaction: async (commands) => {
        const client = await pool.connect()
        let result
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
}