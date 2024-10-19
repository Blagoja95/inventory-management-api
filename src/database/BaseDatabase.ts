const pg = require('pg');

module.exports = class BaseDatabase {
	public pool: any;

    constructor()
    {
        this.pool = new pg.Pool({
            host: process.env.POSTGRES_SERVER_NAME,
            user: process.env.POSTGRES_USERNAME,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DB_NAME,
            port: process.env.POSTGRES_PORT
        });
    }

    cnt(cb, tb)
    {
        this._ckcb(cb);

        this.pool.query('SELECT COUNT(*) FROM ' + tb, (e, r) => cb(e, r));

        // TODO: use triggers with separate table for counting rows
    }

	gt_ll(cb, tb)
	{
		this._ckcb(cb);

		this.pool.query('SELECT * FROM ' + tb
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