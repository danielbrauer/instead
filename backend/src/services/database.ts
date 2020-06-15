import { Pool, ClientBase } from 'pg'
import { PreparedQuery } from '@pgtyped/query'
import config from '../config/config'

const pool = (config.databaseUrl === undefined) ? new Pool() : new Pool({connectionString: config.databaseUrl})

export class PromiseClient {
    client: ClientBase | Pool
    constructor(client: ClientBase | Pool) {
        this.client = client
    }

    async query<TParam, TResult>(query: PreparedQuery<TParam, TResult>, params: TParam) : Promise<TResult[]> {
        return query.run(params, this.client)
    }

    async queryOne<TParam, TResult>(query: PreparedQuery<TParam, TResult>, params: TParam) : Promise<TResult> {
        const [one = null] = await query.run(params, this.client)
        return one
    }

    async count<TParam, TResult extends CountResult>(query: PreparedQuery<TParam, TResult>, params: TParam) : Promise<number> {
        const result = await query.run(params, this.client)
        return result[0].count
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

interface CountResult {
    count : number
}

export default new PoolPromiseClient(pool)