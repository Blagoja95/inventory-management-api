import pg, {Pool} from 'pg';
import {CallbackFunction} from '../types/InventoryTypes';
export default class BaseDatabase {
	public pool: Pool;

	constructor()
    {
		// @ts-ignore
        this.pool = new pg.Pool({
            host: process.env.POSTGRES_SERVER_NAME,
            user: process.env.POSTGRES_USERNAME,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB_NAME,

			// @ts-ignore
            port: process.env.POSTGRES_PORT
        });
    }

    cnt(cb: CallbackFunction, tb: string): void
    {
        this.pool.query('SELECT COUNT(*) FROM ' + tb, (e, r) => cb(e, r));

        // TODO: use triggers with separate table for counting rows
    }

	gt_ll(cb: CallbackFunction, tb: string): void
	{
		this.pool.query('SELECT * FROM ' + tb
		, (e, r) => cb(e, r));
	}

    fndrw(cb: CallbackFunction, tb: string, ky: string, vl: string): void
    {
        this.pool.query('SELECT * FROM ' + tb + ' WHERE ' + ky + ' = \'' + vl + '\';'
        ,(e, r) => cb(e, r));
    }

	dlt(cb: CallbackFunction, tb: string, ky: string, vl: string): void
	{
		this.pool.query('DELETE FROM ' + tb + ' WHERE ' + ky + ' = \'' + vl +'\';'
		, (e, r) => cb(e, r));
	}

	pdt_tm(cb: CallbackFunction, tb: string, ky: string, vl: string, a: string, b: string): void
	{
		this.pool.query('UPDATE ' + tb +
			' SET ' + a + ' = \'' + b + '\'' +
			' WHERE ' + ky + ' = \'' + vl +'\' RETURNING *;'
			, (e, r) => cb(e, r));
	}
}