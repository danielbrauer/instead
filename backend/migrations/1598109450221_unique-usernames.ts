/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.dropIndex('users', 'username')
    pgm.addConstraint('users', 'unique_usernames', {
        unique: 'username',
    })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropConstraint('users', 'unique_usernames')
    pgm.createIndex('users', 'username')
}
