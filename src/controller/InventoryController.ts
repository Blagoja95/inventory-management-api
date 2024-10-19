const InventoryDatabase = require('../database/inventory/InventoryDatabase');

module.exports = class InventoryController
{
    private _BARCODE_LENGTH:number = 12;
	private _db:typeof InventoryDatabase;

    constructor()
    {
        this._db = new InventoryDatabase();
    }

    gt_ll(req, res, next)
    {
        this._db.gt_ll_dt((e, r) =>
        {
            if(e)
            {
                next(new DefaultError(e.message, 400));

                return;
            }

            res.status(200).json(r.rows);
        });
    }

    gt_byd(req, res, next)
    {
        if(req.params.id?.length !== 12)
        {
            throw new DefaultError('Barcode [id] must be length of 12 digits', 400);
        }

        this._db.gt_byd((e, r) =>
        {
            if(e)
            {
                next(new DefaultError(e.message, 400));

                return;
            }

            if(!r.rows || !Array.isArray(r.rows) || r.rows.length < 1)
            {

                next(new DefaultError('Item with barcode [id]: ' + req.params.id + ' does not exist', 404));

                return;
            }

            res.status(200).json(r.rows);
        }, req.params.id);
    }

    gt_by_nm(req, res, next)
    {
        if (!req.params['name'])
        {
            throw new DefaultError('name parameter missing', 400);
        }

        if(req.params.name.length < 1)
        {
            throw new DefaultError('name value can\'t be empty', 400);
        }

        this._db.gt_by_nm((e, r) =>
        {
            if(e)
            {
                next(new DefaultError(e.message, 400));

                return;
            }

            if(!r.rows || !Array.isArray(r.rows) || r.rows.length < 1)
            {

                next(new DefaultError('no record with name: ' + req.params.name + ' found', 404));

                return;
            }

            res.status(200).json(r.rows);
        }, req.params.name, req.query['cap'] === "1");
    }

	gt_rtcls_cnt(req, res, next)
    {
        this._db.cnt((e, r) =>
        {
            if(e)
            {
                next(new DefaultError(e.message, 400));

                return;
            }

            res.status(200).json({inventory_count: Number(r.rows[0].count)});
        }, 'articles');
    }

	gt_msrmnts_cnt(req, res, next)
	{
		this._db.cnt((e, r) =>
		{
			if(e)
			{
				next(new DefaultError(e.message, 400));

				return;
			}

			res.status(200).json({measurements_count: Number(r.rows[0].count)});
		}, 'measurements');
	}

	gt_msrmnts(req, res, next, md = 'id')
	{
		let vl = '', ky = '';

		switch (md)
		{
			case 'id':
				ky = 'id';
				vl = req.params.id;
				break;

			case 'nm':
				if (req.params['name'].length < 3)
				{
					throw new DefaultError('name parameter or it\'s value is missing', 400);
				}

				ky = 'name';
				vl = req.params.name;

				break;

				case 'symbol':
				if (req.params['name'].length < 1)
				{
					throw new DefaultError('symbol name parameter or it\'s value is missing', 400);
				}

				ky = 'symbol';
				vl = req.params.name;

				break;
		}

		this._db.fndrw((e, r) =>
		{
			if(e)
			{
				next(new DefaultError(e.message, 400));
			}

			res.status(200).json(r.rows);
		}, 'measurements', ky, vl);
	}

	gt_ll_msrmnts(req, res, next)
	{
		this._db.gt_ll((e, r) =>
		{
			if(e)
			{
				next(new DefaultError(e.message, 500));
			}

			res.status(200).json(r.rows);
		}, 'measurements');
	}

	crt_tm(req, res, next)
    {
        const {body} = req;

        if (!body['productName'] || typeof body.productName !== 'string' || body.productName.length < 3)
        {
            throw new DefaultError('name parameter is missing or it\'s value is empty', 400);
        }

        if (!body['measurement_id'] || body.measurement_id.length < 1)
        {
            throw new DefaultError('measurement id parameter is missing or it\'s value is empty', 400);
        }

        this._db.fndrw((e, r) =>
        {
            if(e)
            {
                next(new DefaultError(e.message, 400));

                return;
            }

            if(r.rowCount === 0)
            {
                next(new DefaultError('provided measurement id does not exist, create one first!', 400))

                return;
            }

            const bdy = {
                id: this._generateBarCode(), //TODO ID UPGRADE
                name: body.productName,
                quantity: body?.quantity ?? 0,
                price: body?.price ?? 0,
                measurement: r.rows[0].id,
                description: body?.description ?? '',
            };

            this._db.crttm((e, r) =>
            {
                if(e)
                {
                    next(new DefaultError(e.message, 400));

                    return;
                }

                res.status(201).json(r.rows[0]);
            }, bdy);

        }, 'measurements', 'id', body.measurement_id);
    }

	crt_msrmnt(req, res, next)
	{
		const {body} = req;

		if (!body['measurementName'] || typeof body.measurementName !== 'string' || body.measurementName.length < 3)
		{
			throw new DefaultError('measurement name parameter is missing or it\'s value is empty', 400);
		}

		if (!body['symbol'] || typeof body.symbol !== 'string' || body.symbol.length < 1)
		{
			throw new DefaultError('symbol parameter is missing or it\'s value is empty', 400);
		}

		this._db.crtmsrmnt((e, r) =>
		{
			if(e)
			{
				next(new DefaultError(e.message, 400));

				return;
			}

			res.status(201).json(r.rows[0]);
		}, body.measurementName, body.symbol);
	}

	_chk_bdy_f_pdt(bdy, brcd_chk = false)
	{
		if(!bdy['id'] || typeof bdy.id !== 'string')
		{
			throw new DefaultError('provided update is wrong', 400);
		}

		if(brcd_chk && bdy.id.length < 12)
		{
			throw new DefaultError('Barcode [id] must be length of 12 digits', 400);
		}

		if(!bdy['key'] || !bdy['value'])
		{
			throw new DefaultError('key or value of desired update parameters is missing', 400);
		}
	}

	pdt_tm(req, res, next)
	{
		const {body} = req;

		let tb = '';

		switch (body['target'])
		{
			case 'articles':

				this._chk_bdy_f_pdt(body, true);

				tb = 'articles';
				break;

			case 'measurements':
				this._chk_bdy_f_pdt(body);

				tb = 'measurements';
				break;

			default:
				throw new DefaultError('provide target: what to update [articles, measurements]', 400);
		}

		this._db.pdt_tm((e, r) =>
		{
			if(e)
			{
				next(new DefaultError(e.message, 400));

				return;
			}

			res.status(200).json(r.rows[0]);
		}, tb, 'id', body['id'], body['key'], body['value']);
	}

	dlt_tm(req, res, next)
    {
		const {body} = req;

		if (!body['id'] || typeof body.id !== 'string')
		{
			throw new DefaultError('provide barcode [id] value', 400);
		}
		else if(body.id.length < 12)
		{
			throw new DefaultError('Barcode [id] must be length of 12 digits', 400);
		}

		this._db.fndrw((e, r) =>
			{
				if (e)
				{
					next(new DefaultError(e.message, 400));

					return;
				}

				if (r.rowCount === 0)
				{
					next(new DefaultError('item with barcode [id]: ' + body.id + ' does not exists', 409));

					return;
				}

				const rn = r.rows[0].name;

				this._db.dlt((e, r) =>
				{
					if (e)
					{
						next(new DefaultError(e.message, 400));

						return;
					}

					res.status(200)
						.json({info: 'item with barcode [id]: ' + body.id + ' and [name]: ' + rn + ' is now deleted'});

				}, 'articles', 'id', body.id);
			}
			, 'articles', 'id', body.id);
    }

	dlt_msrmnts(req, res, next)
	{
		const {body} = req;

		if (!body['id'] || typeof body.id !== 'string' || body.id.length < 1)
		{
			throw new DefaultError('measurement id is missing', 400);
		}

		this._db.fndrw((e, r) =>
			{
				if(e)
				{
					next(new DefaultError(e.message, 400));

					return;
				}

				if(r.rowCount === 0)
				{
					next(new DefaultError('measurement with id: ' + body.id + ' does not exists', 409));

					return;
				}

				this._db.dlt((e, r) =>
				{
					if(e)
					{
						next(new DefaultError(e.message, 400));

						return;
					}

					res.status(200)
						.json({info: 'measurement with id: ' + body.id +' is now deleted' });
				}, 'measurements', 'id', body.id);
			}
			,'measurements', 'id', body.id);
	}

    _generateBarCode() {
        let result = '';

        const characters = '0123456789';

        for (let i = 0; i < this._BARCODE_LENGTH; i++)
        {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return result;
    }
}