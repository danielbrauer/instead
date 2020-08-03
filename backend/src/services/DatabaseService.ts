import pg, { Pool, ClientBase } from 'pg'
import * as config from '../config/config'
import { Service } from 'typedi'
import { inject } from 'pg-camelcase'

type TransactionContents = (client: ClientBase) => Promise<any>

@Service()
export default class DatabaseService {

    readonly pool: Pool

    constructor() {
        inject(pg)
        this.pool = new Pool({connectionString: config.string('DATABASE_URL')})
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
