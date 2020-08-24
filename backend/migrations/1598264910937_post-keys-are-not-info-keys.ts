/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.dropColumns('keys', 'follow_request_id')
    pgm.dropColumns('users', ['info_key_set_id', 'current_post_key_set_id'])
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumns('users', {
        info_key_set_id: {
            type: 'integer',
            notNull: false,
            references: 'key_sets',
            onDelete: 'RESTRICT',
        },
        current_post_key_set_id: {
            type: 'integer',
            notNull: false,
            references: 'key_sets',
            onDelete: 'RESTRICT',
        },
    })
    pgm.addColumns('keys', {
        follow_request_id: {
            type: 'integer',
            notNull: false,
            references: '"follow_requests"',
            onDelete: 'CASCADE',
        },
    })
}
