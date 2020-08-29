/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createFunction(
        'stale_profile_key',
        [],
        {
            returns: 'trigger',
            language: 'plpgsql',
        },
        `BEGIN
            UPDATE users
            SET profile_key_stale = true
            WHERE id IN (SELECT id FROM old_table);
            RETURN NULL;
        END`,
    )

    pgm.sql(`CREATE TRIGGER "stale_profile_key_on_delete"
                AFTER DELETE ON "profile_keys"
                REFERENCING OLD TABLE AS old_table
                FOR EACH STATEMENT
                EXECUTE PROCEDURE "stale_profile_key"();`)
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTrigger('profile_keys', 'stale_profile_key_on_delete')
    pgm.dropFunction('stale_profile_key', [])
}
