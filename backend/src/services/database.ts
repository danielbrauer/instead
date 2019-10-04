import { Pool, ClientBase } from 'pg'
import config from '../config/config'

const pool = (config.databaseUrl === undefined) ? new Pool() : new Pool({connectionString: config.databaseUrl})

export class PromiseClient {
    client: ClientBase | Pool
    constructor(client: ClientBase | Pool) {
        this.client = client
    }

    async query(text: string, params: string[]) {
        return this.client.query(text, params)
    }

    async queryOne(text: string, params: string[]) {
        const { rows: [one = null] } = await this.client.query(text, params)
        return one
    }

    async count(text: string, params: string[]) : Promise<number> {
        const { rows: [{ count }] } = await this.client.query(text, params)
        return parseInt(count)
    }
}

export class PoolPromiseClient extends PromiseClient {
    async transaction(commands: TransactionContents) {
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
}

type TransactionContents = (client: PromiseClient) => Promise<any>

export default new PoolPromiseClient(pool)