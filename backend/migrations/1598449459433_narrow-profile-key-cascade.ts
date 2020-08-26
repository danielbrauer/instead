/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTrigger('profile_keys', 'cascade_all')

    pgm.createFunction(
        'cascade_all_profile_keys',
        [],
        {
            returns: 'trigger',
            language: 'plpgsql',
            replace: true,
        },
        `BEGIN
            DELETE FROM profile_keys
            WHERE owner_id != recipient_id
            AND out_follow_request_id IS NULL
            AND out_follow_relationship_id IS NULL
            AND in_follow_relationship_id IS NULL
            AND id IN (
                SELECT id FROM new_table
            );
            RETURN NULL;
        END`,
    )

    pgm.sql(`CREATE TRIGGER "cascade_all"
                AFTER UPDATE ON "profile_keys"
                REFERENCING NEW TABLE AS new_table
                FOR EACH STATEMENT
                EXECUTE PROCEDURE "cascade_all_profile_keys"();`)
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTrigger('profile_keys', 'cascade_all')

    pgm.createFunction(
        'cascade_all_profile_keys',
        [],
        {
            returns: 'trigger',
            language: 'plpgsql',
            replace: true,
        },
        `BEGIN
            DELETE FROM profile_keys WHERE owner_id != recipient_id
            AND out_follow_request_id IS NULL
            AND out_follow_relationship_id IS NULL
            AND in_follow_relationship_id IS NULL;
            RETURN NULL;
        END`,
    )

    pgm.createTrigger('profile_keys', 'cascade_all', {
        when: 'AFTER',
        operation: 'UPDATE',
        level: 'STATEMENT',
        function: 'cascade_all_profile_keys',
    })
}
