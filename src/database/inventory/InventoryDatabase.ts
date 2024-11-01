import {NextFunction, Request, Response} from 'express';
import {Statement} from '../../types/DatabaseTypes';

export const gt_ll_db  =  (req: Request, res: Response, next: NextFunction) =>
{
	res.locals.statement = {
		q :
			// 'SELECT * FROM (' +
			'SELECT a.id, a.name, a.price, json_build_object(\'name\', m.name, \'symbol\', m.symbol) AS measurement ' +
			'FROM articles AS a LEFT JOIN measurements AS m ON a.measurement_id = m.id ' +
			'WHERE a.id > \'' + res.locals.data.cursor + '\' ' +
			'LIMIT ' + res.locals.data.limit + '; ' +
			// 'AS sbqry ' +
			// 'ORDER BY sbqry.'+ res.locals.data.order_by + ' ' + res.locals.data.order + '; ' +
			'SELECT COUNT(*) FROM articles;' // TODO TRIGGER for count
	} as Statement;

	next();
}

export const gt_byd_db = (req: Request, res: Response, next: NextFunction) =>
{
	res.locals.statement = {
		q : 'SELECT a.id, a.name, a.price, a.quantity, json_build_object(\'name\', m.name, \'symbol\', m.symbol) AS measurement, a.description FROM articles AS a ' +
			'LEFT JOIN measurements AS m ON a.measurement_id = m.id WHERE a.id = $1;',
		prmtrs: [req.params.id]
	} as Statement;

	next();
}

export const crttm = (req: Request, res: Response, next: NextFunction) =>
{
	res.locals.statement = {
		q: 'INSERT INTO articles (id, name, quantity, measurement_id, price, description) ' +
			'VALUES ($1, $2, $3, $4, $5, $6)' +
			'RETURNING *;',
		prmtrs: res.locals.bdy
	} as Statement;

	next();
}


export const crt_msurmnt = (req: Request, res: Response, next: NextFunction) =>
{
	res.locals.statement = {
		q: 'INSERT INTO measurements (name, symbol) ' +
			'VALUES ($1, $2)' +
			'RETURNING *;',
		prmtrs: [req.body.measurementName, req.body.symbol]
	}

	next();
}