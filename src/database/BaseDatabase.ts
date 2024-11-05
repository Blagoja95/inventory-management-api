import pg, {Pool, types} from 'pg';
import {NextFunction, Request, Response} from "express";
import {Statement} from "../types/DatabaseTypes";
import {DbError} from "../errors/DbError";

types.setTypeParser(1700, (vl) => parseFloat(vl));

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
			res.locals.result = await pool.query(res.locals.statement.q, res.locals.statement.prmtrs);
		}

		next();

	} catch (e: any)
	{
		next(new DbError(e, 400));
	}
}

export const cnt_db = (tb: string) =>
{
	return (req: Request, res: Response, next: NextFunction) =>
	{

		res.locals.tb = tb;
		res.locals.statement = {
			q : 'SELECT row_count as count FROM rw_count WHERE table_name = \''  + tb + '\';'
		} as Statement;

		next();
	}
}

export const fndrw = (req: Request, res: Response, next: NextFunction) =>
{
	res.locals.statement = {
		q: 'SELECT * FROM $1 WHERE $2 = $3;',
		prmtrs: [res.locals.tb, res.locals.prms.ky, res.locals.prms.vl]
	} as Statement

	next()
}

export const dlt_gnrc = (tb: string) =>
{
	return (req: Request, res: Response, next: NextFunction) =>
	{
		res.locals.statement = {
			q: 'DELETE FROM ' + tb + ' WHERE id = $1;',
			prmtrs: [req.params.id]
		} as Statement

		next();
	}
}
