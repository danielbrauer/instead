import { Pool, ClientBase } from "pg"

type TransactionContents = (client: ClientBase) => Promise<any>

export default class DatabaseServiceMock {

    readonly pool: Pool = { } as Pool

    async transaction(commands: TransactionContents) {
        const client = { } as ClientBase
        await commands(client)
    }

}
