import pg, {Pool} from 'pg';
import {CallbackFunction} from '../types/InventoryTypes';
import {NextFunction, Request, Response} from "express";
import DefaultError from "../errors/DefaultError";
import {Statement} from "../types/DatabaseTypes";

// @ts-ignore
export const pool = new pg.Pool({
	host: process.env.POSTGRES_SERVER_NAME,
	user: process.env.POSTGRES_USERNAME,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB_NAME,

	// @ts-ignore
	port: process.env.POSTGRES_PORT
});

export const db_wrppr = async (req: Request, res: Response, next: NextFunction)=>
{
	try
	{
		if(res.locals.statement?.prmtrs?.length === 0)
		{
			res.locals.result = await pool.query(res.locals.statement.q);
		}
		else
		{
			console.log(res.locals.statement)
			res.locals.result = await pool.query(res.locals.statement.q, res.locals.statement.prmtrs);
		}

		next();

	} catch (e: any)
	{
		next(new DefaultError(e.message, 500));
	}
}

export const cnt_db = (tb: string) =>
{
	return (req: Request, res: Response, next: NextFunction) =>
	{

		res.locals.tb = tb;
		res.locals.statement = {
			q : 'SELECT COUNT(*) FROM ' + tb
		} as Statement;

		next();
		// TODO: use triggers with separate table for counting rows
	}
}

export const fndrw = (req: Request, res: Response, next: NextFunction) =>
{
	res.locals.statement = {
		q: 'SELECT * FROM ' + res.locals.tb + ' WHERE ' + res.locals.prms.ky + ' = \'' + res.locals.prms.vl + '\';'
	}

	next()
}

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

	gt_ll(cb: CallbackFunction, tb: string): void
	{
		this.pool.query('SELECT * FROM ' + tb
		, (e, r) => cb(e, r));
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