
module.exports = class InventoryDatabase extends require('../BaseDatabase')
{
	constructor()
	{
		super();
	}

	gt_ll_dt (cb)
	{
		this._ckcb(cb);

		this.pool.query('SELECT a.id, a.name, a.price, a.quantity, json_build_object(\'name\', m.name, \'symbol\', m.symbol) AS measurement, a.description ' +
			'FROM articles AS a FULL JOIN measurements AS m ON a.measurement_id = m.id;', (e, r) => cb(e, r));
	}

	gt_by_nm(cb, nm, cp)
	{
		this._ckcb(cb);

		if(cp)
		{
			nm = nm.charAt(0).toUpperCase() + nm.slice(1);
		}

		this.pool.query('SELECT a.id, a.name, a.price, a.quantity, json_build_object(\'name\', m.name, \'symbol\', m.symbol) AS measurement, a.description FROM articles AS a ' +
			'FULL JOIN measurements AS m ON a.measurement_id = m.id WHERE a.name = $1;'
			, [nm]
			, (e, r) => cb(e, r));
	}

	gt_byd(cb, d)
	{
		this._ckcb(cb);

		this.pool.query('SELECT a.id, a.name, a.price, a.quantity, json_build_object(\'name\', m.name, \'symbol\', m.symbol) AS measurement, a.description FROM articles AS a ' +
			'FULL JOIN measurements AS m ON a.measurement_id = m.id WHERE a.id = $1;'
			, [d]
			, (e, r) => cb(e, r));
	}

	crtmsrmnt(cb, nm, symbl)
	{
		this._ckcb(cb);

		this.pool.query('INSERT INTO measurements (name, symbol) ' +
			'VALUES (\'' + nm + '\' ,\'' + symbl + '\')' +
			'RETURNING *;'
			,(e, r) => cb(e, r));
	}

	crttm(cb, bdy)
	{
		this._ckcb(cb);

		this.pool.query('INSERT INTO articles (id, name, quantity, measurement_id, price, description) ' +
			'VALUES (' + bdy.id + ', \'' + bdy.name + '\',' + bdy.quantity + ' ,' + bdy.measurement + ' ,' +  bdy.price + ' ,\''  + bdy.description + '\')' +
			'RETURNING *;'
			,(e, r) => cb(e, r));
	}

}