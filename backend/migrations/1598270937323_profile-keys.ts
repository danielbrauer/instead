/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumns('users', {
        profile_key_stale: {
            type: 'boolean',
            notNull: true,
            default: 'true',
        },
    })

    pgm.addColumns('profile_keys', {
        out_follow_request_id: {
            type: 'integer',
            notNull: false,
            references: 'follow_requests',
            onDelete: 'SET NULL',
        },
        out_follow_relationship_id: {
            type: 'integer',
            notNull: false,
            references: 'follow_relationships',
            onDelete: 'SET NULL',
        },
        in_follow_relationship_id: {
            type: 'integer',
            notNull: false,
            references: 'follow_relationships',
            onDelete: 'SET NULL',
        },
    })

    pgm.createFunction(
        'cascade_all_profile_keys',
        [],
        {
            returns: 'trigger',
            language: 'plpgsql',
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
