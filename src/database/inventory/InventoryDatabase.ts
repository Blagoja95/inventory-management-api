import BaseDatabase from "../BaseDatabase";
import {CallbackFunction, InventoryItem} from "../../types/InventoryTypes";

export default class InventoryDatabase extends BaseDatabase
{
	constructor()
	{
		super();
	}

	gt_ll_dt (cb: CallbackFunction)
	{
		this.pool.query('SELECT a.id, a.name, a.price, a.quantity, json_build_object(\'name\', m.name, \'symbol\', m.symbol) AS measurement, a.description ' +
			'FROM articles AS a FULL JOIN measurements AS m ON a.measurement_id = m.id;', (e, r) => cb(e, r));
	}

	gt_by_nm(cb: CallbackFunction, nm: string, cp: boolean)
	{
		if(cp)
		{
			nm = nm.charAt(0).toUpperCase() + nm.slice(1);
		}

		this.pool.query('SELECT a.id, a.name, a.price, a.quantity, json_build_object(\'name\', m.name, \'symbol\', m.symbol) AS measurement, a.description FROM articles AS a ' +
			'FULL JOIN measurements AS m ON a.measurement_id = m.id WHERE a.name = $1;'
			, [nm]
			, (e, r) => cb(e, r));
	}

	gt_byd(cb: CallbackFunction, d: string)
	{
		this.pool.query('SELECT a.id, a.name, a.price, a.quantity, json_build_object(\'name\', m.name, \'symbol\', m.symbol) AS measurement, a.description FROM articles AS a ' +
			'FULL JOIN measurements AS m ON a.measurement_id = m.id WHERE a.id = $1;'
			, [d]
			, (e, r) => cb(e, r));
	}

	crtmsrmnt(cb: CallbackFunction, nm: string, symbl: string)
	{
		this.pool.query('INSERT INTO measurements (name, symbol) ' +
			'VALUES (\'' + nm + '\' ,\'' + symbl + '\')' +
			'RETURNING *;'
			,(e, r) => cb(e, r));
	}

	crttm(cb: CallbackFunction, bdy: InventoryItem)
	{
		this.pool.query('INSERT INTO articles (id, name, quantity, measurement_id, price, description) ' +
			'VALUES (' + bdy.id + ', \'' + bdy.name + '\',' + bdy.quantity + ' ,' + bdy.measurement + ' ,' +  bdy.price + ' ,\''  + bdy.description + '\')' +
			'RETURNING *;'
			,(e, r) => cb(e, r));
	}

}