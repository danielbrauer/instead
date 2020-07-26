/* eslint-disable camelcase */
import { ColumnDefinitions, MigrationBuilder } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions = {}

export function up(pgm: MigrationBuilder): void {
    pgm.createTable('users', {
        id: 'id',
        username: { type: 'text', notNull: true },
        verifier: { type: 'text', notNull: true },
        srp_salt: { type: 'text', notNull: true },
        display_name: { type: 'text', notNull: true },
        muk_salt: { type: 'text', notNull: true },
        private_key: { type: 'text', notNull: true },
        public_key: { type: 'jsonb', notNull: true },
        private_key_iv: { type: 'text', notNull: true },
    })
    pgm.createIndex('users', 'username')
    pgm.createTable('key_sets', {
        id: 'id',
        valid_start: { type: 'timestamp without time zone', notNull: true, default: pgm.func('now()') },
        valid_end: 'timestamp without time zone',
        owner_id: {
            type: 'integer',
            notNull: true,
            references: '"users"',
            onDelete: 'CASCADE'
        }
    })
    pgm.createTable('keys', {
        key: { type: 'text', notNull: true },
        user_id: {
            type: 'integer',
            notNull: true,
            references: '"users"',
            onDelete: 'CASCADE',
        },
        key_set_id: {
            type: 'integer',
            notNull: true,
            references: '"key_sets"',
            onDelete: 'CASCADE',
        },
    })
    pgm.addConstraint('keys', 'keys_pkey', {
        primaryKey: [ 'user_id', 'key_set_id' ],
    })
    pgm.createTable('followers', {
        follower_id: {
            type: 'integer',
            notNull: true,
            references: '"users"',
            onDelete: 'CASCADE',
        },
        followee_id: {
            type: 'integer',
            notNull: true,
            references: '"users"',
            onDelete: 'CASCADE',
        },
    })
    pgm.addConstraint('followers', 'followers_pkey', {
        primaryKey: [ 'follower_id', 'followee_id' ],
    })
    pgm.createTable('follow_requests', {
        requester_id: {
            type: 'integer',
            notNull: true,
            references: '"users"',
            onDelete: 'CASCADE',
        },
        requestee_id: {
            type: 'integer',
            notNull: true,
            references: '"users"',
            onDelete: 'CASCADE',
        },
    })
    pgm.addConstraint('follow_requests', 'follow_requests_pkey', {
        primaryKey: [ 'requester_id', 'requestee_id' ],
    })
    pgm.createTable('posts', {
        id: 'id',
        published: 'timestamp without time zone',
        author_id: {
            type: 'integer',
            notNull: true,
            references: '"users"',
            onDelete: 'CASCADE',
        },
        filename: { type: 'text', notNull: true },
        key_set_id: {
            type: 'integer',
            notNull: true,
            references: '"key_sets"',
            onDelete: 'CASCADE',
        },
        iv: { type: 'text', notNull: true },
        aspect: { type: 'real', notNull: true }
    })
    pgm.createIndex('posts', 'published')
}

export function down(pgm: MigrationBuilder): void {}