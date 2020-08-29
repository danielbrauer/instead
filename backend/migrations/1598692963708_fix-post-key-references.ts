/* eslint-disable @typescript-eslint/camelcase */
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.dropTrigger('post_keys', 'set_dependencies')
    pgm.dropFunction('set_post_key_dependencies', [])
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
                WHERE follow_relationships.follower_id = post_keys.recipient_id
                AND follow_relationships.followee_id IN (
                    SELECT owner_id FROM post_key_sets
                    WHERE id = post_keys.post_key_set_id
                )
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

export async function down(pgm: MigrationBuilder): Promise<void> {}
