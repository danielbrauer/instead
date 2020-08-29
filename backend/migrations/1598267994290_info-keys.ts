/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('profile_keys', {
        id: 'id',
        recipient_id: {
            type: 'integer',
            references: '"users"',
            notNull: true,
            onDelete: 'CASCADE',
        },
        owner_id: {
            type: 'integer',
            references: '"users"',
            notNull: true,
            onDelete: 'CASCADE',
        },
        key: { type: 'text', notNull: true },
    })

    pgm.renameTable('keys', 'post_keys')
    pgm.renameTable('key_sets', 'post_key_sets')
    pgm.renameColumn('post_keys', 'key_set_id', 'post_key_set_id')
    pgm.renameColumn('post_keys', 'user_id', 'recipient_id')
    pgm.renameColumn('posts', 'key_set_id', 'post_key_set_id')
    pgm.renameColumn('comments', 'key_set_id', 'post_key_set_id')
}
