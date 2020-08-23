/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.renameTable('followers', 'follow_relationships')
    pgm.renameColumn('keys', 'follower_id', 'follow_relationship_id')
}
