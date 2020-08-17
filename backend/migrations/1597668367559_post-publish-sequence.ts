/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createSequence('posts_published_seq', {
        type: 'integer',
        start: 0,
        increment: 1,
    })
    pgm.addColumn('posts', {
        publish_order: {
            type: 'integer',
            notNull: true,
            default: pgm.func("nextval('posts_published_seq')"),
        },
    })
    pgm.alterColumn('posts', 'publish_order', {
        default: null,
        notNull: false,
    })
    pgm.dropIndex('posts', 'published')
    pgm.addIndex('posts', 'publish_order')
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropColumn('posts', 'publish_order')
    pgm.dropSequence('posts_published_seq')
    pgm.dropIndex('posts', 'publish_order')
    pgm.addIndex('posts', 'published')
}
