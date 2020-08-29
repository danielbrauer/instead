/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createFunction(
        'invalidate_post_key_set',
        [],
        {
            returns: 'trigger',
            language: 'plpgsql',
        },
        `BEGIN
            UPDATE post_key_sets
            SET valid_end = now()
            WHERE owner_id = OLD.followee_id AND valid_end IS NULL;
            RETURN NULL;
        END`,
    )

    pgm.createTrigger('follow_relationships', 'invalidate_post_key_set_on_delete', {
        when: 'AFTER',
        operation: 'DELETE',
        level: 'ROW',
        function: 'invalidate_post_key_set',
    })
}
