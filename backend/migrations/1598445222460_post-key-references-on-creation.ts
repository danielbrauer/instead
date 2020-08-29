/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createFunction(
        'set_post_key_dependencies',
        [],
        {
            returns: 'trigger',
            language: 'plpgsql',
        },
        `BEGIN
            UPDATE post_keys
            SET follow_relationship_id = (
                SELECT id FROM follow_relationships
                WHERE follow_relationships.followee_id = post_keys.owner_id
                AND follow_relationships.follower_id = post_keys.recipient_id
            )
            WHERE post_keys.id IN (
                SELECT id FROM new_table
            );
            RETURN NULL;
        END`,
    )

    pgm.sql(`CREATE TRIGGER "set_dependencies"
                AFTER INSERT ON "post_keys"
                REFERENCING new TABLE AS new_table
                FOR EACH STATEMENT
                EXECUTE PROCEDURE "set_post_key_dependencies"();`)
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTrigger('post_keys', 'set_dependencies')
    pgm.dropFunction('set_post_key_dependencies', [])
}
