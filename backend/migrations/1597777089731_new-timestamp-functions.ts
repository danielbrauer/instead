/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate'

export const shorthands: ColumnDefinitions | undefined = undefined

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.createFunction(
        'timestamp_to_int',
        [
            {
                type: 'timestamp without time zone',
            },
        ],
        {
            returns: 'int8',
            language: 'plpgsql',
        },
        `BEGIN
            return EXTRACT(EPOCH FROM $1)*1000000;
        END`,
    )
    pgm.createFunction(
        'int_to_timestamp',
        [
            {
                type: 'int8',
            },
        ],
        {
            returns: 'timestamp without time zone',
            language: 'plpgsql',
        },
        `BEGIN
            return TIMESTAMP WITHOUT TIME ZONE 'epoch' + ($1 * 0.000001) * INTERVAL '1 second';
        END`,
    )
}

export async function down(pgm: MigrationBuilder): Promise<void> {
    pgm.dropFunction('timestamp_to_int', [
        {
            type: 'timestamp without time zone',
        },
    ])
    pgm.dropFunction('int_to_timestamp', [
        {
            type: 'int8',
        },
    ])
}
