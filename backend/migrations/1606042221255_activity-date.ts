/* eslint-disable @typescript-eslint/camelcase */
import { MigrationBuilder, ColumnDefinitions } from 'node-pg-migrate';

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
    pgm.addColumn('users', {
        activity_last_checked: {
            type: 'timestamp without time zone',
            notNull: true,
            default: pgm.func('CURRENT_TIMESTAMP')
        }
    })
}
