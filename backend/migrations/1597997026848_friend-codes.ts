/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumns('users', {
        friend_code: {
            type: 'text',
            notNull: false,
        },
    })
    pgm.addIndex('users', 'friend_code', { unique: true })
    pgm.addColumn('follow_requests', {
        friend_code: {
            type: 'text',
            notNull: false,
        },
    })
}
