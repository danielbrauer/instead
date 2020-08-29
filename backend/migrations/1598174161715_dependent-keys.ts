/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.dropConstraint('follow_requests', 'follow_requests_pkey')
    pgm.addColumns('follow_requests', {
        id: 'id',
    })
    pgm.addConstraint('follow_requests', 'unique_follow_requests', {
        unique: ['requester_id', 'requestee_id'],
    })

    pgm.dropConstraint('followers', 'followers_pkey')
    pgm.addColumns('followers', {
        id: 'id',
    })
    pgm.addConstraint('followers', 'unique_followers', {
        unique: ['follower_id', 'followee_id'],
    })

    pgm.dropConstraint('keys', 'keys_pkey')
    pgm.addColumns('keys', {
        id: 'id',
    })
    pgm.addConstraint('keys', 'unique_keys', {
        unique: ['user_id', 'key_set_id'],
    })

    pgm.addColumns('keys', {
        follow_request_id: {
            type: 'integer',
            notNull: false,
            references: '"follow_requests"',
            onDelete: 'CASCADE',
        },
        follower_id: {
            type: 'integer',
            notNull: false,
            references: '"followers"',
            onDelete: 'CASCADE',
        },
    })

    pgm.addColumns('users', {
        current_post_key_set_id: {
            type: 'integer',
            notNull: false,
            references: 'key_sets',
            onDelete: 'RESTRICT',
        },
    })

    pgm.dropColumn('users', 'info_key_set_id')
    pgm.addColumns('users', {
        info_key_set_id: {
            type: 'integer',
            notNull: false,
            references: 'key_sets',
            onDelete: 'RESTRICT',
        },
    })
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropColumns('users', 'info_key_set_id')
    pgm.addColumns('users', {
        info_key_set_id: {
            type: 'integer',
            notNull: false,
            references: 'key_sets',
            onDelete: 'SET NULL',
        },
    })

    pgm.dropColumns('users', 'current_post_key_set_id')

    pgm.dropColumns('keys', ['follow_request_id', 'follower_id'])

    pgm.dropConstraint('keys', 'unique_keys')
    pgm.dropColumns('keys', 'id')
    pgm.addConstraint('keys', 'keys_pkey', {
        primaryKey: ['user_id', 'key_set_id'],
    })

    pgm.dropConstraint('followers', 'unique_followers')
    pgm.dropColumns('followers', 'id')
    pgm.addConstraint('followers', 'followers_pkey', {
        primaryKey: ['follower_id', 'followee_id'],
    })

    pgm.dropConstraint('follow_requests', 'unique_follow_requests')
    pgm.dropColumns('follow_requests', 'id')
    pgm.addConstraint('follow_requests', 'follow_requests_pkey', {
        primaryKey: ['requester_id', 'requestee_id'],
    })
}
