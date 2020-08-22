/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.dropIndex('users', 'friend_code_unique')
    pgm.addConstraint('users', 'unique_friend_codes', {
        unique: 'friend_code',
    })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropConstraint('users', 'unique_friend_codes')
    pgm.addIndex('users', 'friend_code', { unique: true })
}
