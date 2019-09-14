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

module.exports = {
    query: (text, params) => pool.query(text, params),
}