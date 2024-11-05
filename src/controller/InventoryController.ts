import DefaultError from '../errors/DefaultError';
import {Request, Response, NextFunction} from "express";
import {Count_Response_Body, Statement, Update} from "../types/DatabaseTypes";
import {pgntn_rspns_bdy} from "../types/InventoryTypes";

export const gt_ll_cntrl = (req: Request, res: Response, next: NextFunction) =>
{
	res.status(200).json(res.locals.result.rows);
}

export const hndl_pgntn_rspns_cntrl = (req: Request, res: Response, next: NextFunction) =>
{
	if(res.locals.result[0].rowCount !== 0)
	{
		res.status(200).json({
			cursor: res.locals.result[0].rows[res.locals.result[0].rows.length - 1].id,
			size: res.locals.result[0].rowCount,
			records_count: Number(res.locals.result[1].rows[0].row_count),

			records: res.locals.result[0].rows
		} as pgntn_rspns_bdy);
	}
	else
	{
		res.status(200).json({
			cursor: '0',
			size:  0,
			records_count: 0,

			records: []
		} as pgntn_rspns_bdy);
	}
}

export const dlt_rspon_cntrl = (req: Request, res: Response, next: NextFunction) =>
{
	if(res.locals.result.rowCount !== 0)
	{
		res.status(200).json({message: `record with id ${req.params.id} successfully deleted`});
	} else
	{
		res.status(400).json({message: `record with id ${req.params.id} not found`});
	}
}

export const gt_byd_cntrl = (req: Request, res: Response, next: NextFunction) =>
{
	if(!res.locals.result.rows || !Array.isArray(res.locals.result.rows) || res.locals.result.rows.length === 0)
	{

		next(new DefaultError('Item with barcode [id]: ' + req.params.id + ' does not exist', 404));

		return;
	}

	res.status(200).json(res.locals.result.rows);
}

export const gt_cnt_cntrl = (req: Request, res: Response, next: NextFunction) =>
{
	const rs: Count_Response_Body = {};

	switch (res.locals.tb)
	{
		case 'articles':
			rs.inventory_count = Number(res.locals.result.rows[0].count);
			break;

		case 'measurements':
			rs.measurements_count = Number(res.locals.result.rows[0].count);
	}

	res.status(200).json(rs);
}

export const prp_msrmnts_cntrl = (md: 'id' | 'nm' | 'symbol') =>
{
	return (req: Request, res: Response, next: NextFunction) =>
	{
		let vl: string = '', ky: string = '';

		switch (md)
		{
			case 'id':
				ky = 'id';
				vl = req.params.id;
				break;

			case 'nm':
				ky = 'name';
				vl = req.params.name;
				break;

			case 'symbol':
				ky = 'symbol';
				vl = req.params.name;
				break;
		}
		res.locals.statement = {
			q: 'SELECT * FROM measurements WHERE ' + ky + ' = \'' + vl + '\';',
		} as Statement;

		next();
	}
}

export const prpr_tm_bdy = (req: Request, res: Response, next: NextFunction) =>
{
    const {body} = req;

	res.locals.bdy = [
		_generateBarCode(),
		body.productName,
		body?.quantity ?? 0,
		body.measurement_id,
		body?.price ?? 0,
		body?.description ?? ''
	];

	next();
}

const _BARCODE_LENGTH: number = 12;

const _generateBarCode = (): string =>
{
	let result: string = '';

	for (let i: number = 0; i < _BARCODE_LENGTH; i++)
	{
		result += Math.floor(Math.random() * 10);
	}

	return result;
}