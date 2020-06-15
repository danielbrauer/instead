import { Pool, ClientBase } from 'pg'
import config from '../config/config'

type TransactionContents = (client: ClientBase) => Promise<any>

const pool = (config.databaseUrl === undefined) ? new Pool() : new Pool({connectionString: config.databaseUrl})

export const transaction = async(commands: TransactionContents) => {
    const client = await pool.connect()
    let result = null
    try {
        await client.query('BEGIN')
        result = await commands(client)
        await client.query('COMMIT')
    } catch (e) {
        await client.query('ROLLBACK')
        throw e
    } finally {
        client.release()
    }
    return result
}

export default pool