/* eslint-disable @typescript-eslint/camelcase */
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumn('posts', {
        version: {
            type: 'smallint',
            notNull: true,
            default: '0',
        },
    })
    pgm.createTable('post_upgrades', {
        id: 'id',
        post_id: {
            type: 'integer',
            notNull: true,
            references: '"posts"',
            onDelete: 'CASCADE',
        },
        encrypted_info: { type: 'text', notNull: true },
        filename: { type: 'text', notNull: true },
        version: { type: 'smallint', notNull: true },
    })
}

