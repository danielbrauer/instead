/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumns('users', {
        display_name_iv: {
            type: 'text',
            notNull: false,
        },
        info_key_set_id: {
            type: 'integer',
            references: 'key_sets',
            notNull: false,
            onDelete: 'SET NULL',
        },
    })
    pgm.alterColumn('users', 'display_name', {
        notNull: false,
    })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.alterColumn('users', 'display_name', {
        notNull: true,
    })
    pgm.dropColumns('users', ['display_name_iv', 'info_key_set_id'])
}
