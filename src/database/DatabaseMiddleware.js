const pg = require('pg');
const DefaultError = require('../errors/DefaultError');

module.exports = class DatabaseMiddleware {
    constructor(table)
    {
        this.pool = new pg.Pool({
            host: process.env.POSTGRES_SERVER_NAME,
            user: process.env.POSTGRES_USERNAME,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB_NAME,
            port: process.env.POSTGRES_PORT
        });
    }

    gtlldt (cb)
    {
        this._ckcb(cb);

        this.pool.query('SELECT a.id, a.name, a.price, a.quantity, json_build_object(\'name\', m.name, \'symbol\', m.symbol) AS measurement, a.description ' +
            'FROM articles AS a FULL JOIN measurements AS m ON a.measurement_id = m.id;', (e, r) => cb(e, r));
    }

    cnt(cb, tb)
    {
        this._ckcb(cb);

        this.pool.query('SELECT COUNT(*) FROM ' + tb, (e, r) => cb(e, r));

        // TODO: use triggers with separate table for counting rows
    }

    gtbynm(cb, nm, cp)
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

    gtbyd(cb, d)
    {
        this._ckcb(cb);

        this.pool.query('SELECT a.id, a.name, a.price, a.quantity, json_build_object(\'name\', m.name, \'symbol\', m.symbol) AS measurement, a.description FROM articles AS a ' +
            'FULL JOIN measurements AS m ON a.measurement_id = m.id WHERE a.id = $1;'
            , [d]
            , (e, r) => cb(e, r));
    }

	gt_ll_msrmnts(cb)
	{
		this._ckcb(cb);

		this.pool.query('SELECT * FROM measurements'
		, (e, r) => cb(e, r));
	}

    _ckcb(cb)
    {
        if (!cb || typeof cb !== 'function')
        {
            throw new DefaultError('cb must be a function', 500);
        }
    }

    fndrw(cb, tb, ky, vl)
    {
        this._ckcb(cb);

        this.pool.query('SELECT * FROM ' + tb + ' WHERE ' + ky + ' = \'' + vl + '\';'
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

	crtmsrmnt(cb, nm, symbl)
    {
        this._ckcb(cb);

		this.pool.query('INSERT INTO measurements (name, symbol) ' +
			'VALUES (\'' + nm + '\' ,\'' + symbl + '\')' +
			'RETURNING *;'
			,(e, r) => cb(e, r));
    }

	dlt(cb, tb, ky, vl)
	{
		this._ckcb(cb);

		this.pool.query('DELETE FROM ' + tb + ' WHERE ' + ky + ' = \'' + vl +'\';'
		, (e, r) => cb(e, r));
	}

	pdt_tm(cb, tb, ky, vl, a, b)
	{
		this._ckcb(cb);

		this.pool.query('UPDATE ' + tb +
			' SET ' + a + ' = \'' + b + '\'' +
			' WHERE ' + ky + ' = \'' + vl +'\' RETURNING *;'
			, (e, r) => cb(e, r));
	}
}