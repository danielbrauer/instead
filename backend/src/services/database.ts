import { Pool, ClientBase } from 'pg'
import config from '../config/config'
import { Service } from 'typedi'

type TransactionContents = (client: ClientBase) => Promise<any>

@Service()
export default class Database {

    pool: Pool

    constructor() {
        this.pool = (config.databaseUrl === undefined) ? new Pool() : new Pool({connectionString: config.databaseUrl})
    }

    isCountZero(count: any) {
        return BigInt(count) == BigInt(0)
    }

    async transaction(commands: TransactionContents) {
        const client = await this.pool.connect()
        try {
            await client.query('BEGIN')
            await commands(client)
            await client.query('COMMIT')
        } catch (e) {
            await client.query('ROLLBACK')
            throw e
        } finally {
            client.release()
        }
    }

}
