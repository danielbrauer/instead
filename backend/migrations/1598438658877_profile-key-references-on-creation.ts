/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createFunction(
        'set_profile_key_dependencies',
        [],
        {
            returns: 'trigger',
            language: 'plpgsql',
        },
        `BEGIN
            UPDATE profile_keys
            SET in_follow_relationship_id = (
                SELECT id FROM follow_relationships
                WHERE follow_relationships.followee_id = profile_keys.owner_id
                AND follow_relationships.follower_id = profile_keys.recipient_id
            ),
            out_follow_relationship_id = (
                SELECT id FROM follow_relationships
                WHERE follow_relationships.followee_id = profile_keys.recipient_id
                AND follow_relationships.follower_id = profile_keys.owner_id
            ),
            out_follow_request_id = (
                SELECT id FROM follow_requests
                WHERE follow_requests.requester_id = profile_keys.owner_id
                AND follow_requests.requestee_id = profile_keys.recipient_id
            )
            WHERE profile_keys.id IN (
                SELECT id FROM new_table
            );
            RETURN NULL;
        END`,
    )

    pgm.sql(`CREATE TRIGGER "set_dependencies"
                AFTER INSERT ON "profile_keys"
                REFERENCING new TABLE AS new_table
                FOR EACH STATEMENT
                EXECUTE PROCEDURE "set_profile_key_dependencies"();`)
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTrigger('profile_keys', 'set_dependencies')
    pgm.dropFunction('set_profile_key_dependencies', [])
}
