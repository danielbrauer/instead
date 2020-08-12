/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createTable('comments', {
        id: 'id',
        published: {
            type: 'timestamp without time zone',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP')
        },
        author_id: {
            type: 'integer',
            notNull: true,
            references: '"users"',
            onDelete: 'CASCADE',
        },
        post_id: {
            type: 'integer',
            notNull: true,
            references: '"posts"',
            onDelete: 'CASCADE',
        },
        key_set_id: {
            type: 'integer',
            notNull: true,
            references: '"key_sets"',
            onDelete: 'CASCADE',
        },
        content: { type: 'text', notNull: true },
        content_iv: { type: 'text', notNull: true },
    })
    pgm.createIndex('comments', ['post_id', 'published'])
}
