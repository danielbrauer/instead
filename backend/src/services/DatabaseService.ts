import { Pool, ClientBase } from 'pg'
import config from '../config/config'
import { Service } from 'typedi'

type TransactionContents = (client: ClientBase) => Promise<any>

@Service()
export default class DatabaseService {

    readonly pool: Pool

    constructor() {
        this.pool = (config.databaseUrl === undefined) ? new Pool() : new Pool({connectionString: config.databaseUrl})
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
