const DatabaseMiddleware = require('../database/DatabaseMiddleware');
const DefaultError = require("../errors/DefaultError");

module.exports = class InventoryController
{
    _BARCODE_LENGTH = 12;
    _dbMiddleware = null;

    constructor()
    {
        this._dbMiddleware = new DatabaseMiddleware(process.env.DB_NAME);
    }

    getAll(req, res)
    {
        res.status(200).json(this._dbMiddleware.parsedInMemoryJSON);
    }

    getById(req, res)
    {
        if(req.params.id?.length !== 12)
        {
            throw new DefaultError('Barcode [id] must be length of 12 digits');
        }

        if(!Number.isInteger(parseInt(req.params.id)))
        {
            throw new DefaultError('Barcode [id] must be a number', 400);
        }

        const result = this._dbMiddleware.getItemById(req.params.id);

        if(result === -1)
        {
            throw new DefaultError('Item with barcode [id]: ' + req.params.id + ' does not exist', 404);
        }

        res.status(200).json(result);
    }

    getByName(req, res, next)
    {
        if (!req.params['name'])
        {
            throw new DefaultError('name parameter missing', 400);
        }

        if(req.params.name.length < 1)
        {
            throw new DefaultError('name value can\'t be empty', 400);
        }

        const a = this._dbMiddleware.getItemByName(req.params.name)

        if (a === null)
        {
            throw new DefaultError('no record with name: ' + req.params.name + ' found', 404);
        }

        res.status(200).json(a);
    }

    getItemsCount(req, res)
    {
        res.status(200).json({inventory_articles: this._dbMiddleware.count});
    }

    createItem(req, res)
    {
        const {body} = req;

        if (!body['productName'] || typeof body.productName !== 'string' || body.productName.length < 3)
        {
            throw new DefaultError('name parameter value is missing or it is a empty string', 400);
        }

        if (Object.keys(this._dbMiddleware.getItemByName(body.productName)).length !== 0)
        {
            throw new DefaultError('item ' + body.productName + ' already exists', 409);
        }

        const itemBody = {
            id: this._generateBarCode(),
            quantity: body?.quantity ?? 0,
            measurement: {
                name: body?.measurement?.name ?? '',
                symbol: body?.measurement?.symbol ?? '',
            },
            price: body?.price ?? 0,
            description: body?.description ?? '',
        };

        if (this._dbMiddleware.createItem(body.productName, itemBody) === 1)
        {
            res.status(201).json(itemBody);
        }
        else
        {
            throw new DefaultError();
        }
    }

     updateItem(req, res)
    {
        const {body} = req;
        let result;

        if(!body['productName'] || typeof body.productName !== 'string' || body.productName.length < 3)
        {
            if(!body['id'] || typeof body.id !== 'string' || body.id.length < 12)
            {
                throw new DefaultError('provide either product name value or barcode [id] value', 400);
            }

            if(!body['key'] || !body['value'])
            {
                throw new DefaultError('key or value of desired update parameters is missing', 400);
            }

            result = this._dbMiddleware.updateByID(body.id, body.key, body.value);
        }
        else
        {
            result = this._dbMiddleware.updateByName(body.productName, body.key, body.value);
        }

        res.status(200).json(result.data);
    }

     deleteItem(req, res)
    {
        const {body} = req;

        if(!body['productName'] || typeof body.productName !== 'string' || body.productName.length < 3)
        {
            if(!body['id'] || typeof body.id !== 'string' || body.id.length < 12)
            {
                throw new DefaultError('provide either product name value or barcode [id] value', 400);
            }

            const item = Object.keys(this._dbMiddleware.getItemById(body.id, true));

            if (item.length === 0)
            {
                throw new DefaultError('item with barcode [id]: ' + body.id + ' does not exists', 409);
            }


            if(this._dbMiddleware.deleteByName(item[0]) === 1)
            {
                res.status(200)
                    .json({info: 'item with barcode [id]: ' + body.id + ' and [name]: ' + item[0] +' is now deleted' });
            }
        }
        else
        {
            if (Object.keys(this._dbMiddleware.getItemByName(body.productName)).length === 0)
            {
                throw new DefaultError('item ' + body.productName + ' does not exists', 409);
            }

            if(this._dbMiddleware.deleteByName(body.productName) === 1)
            {
                res.status(200).json({info: 'Item by name ' + body.productName + ' is now deleted' });
            }
        }
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

    _getBody()
    {
        return new Promise((resolve, reject) => {
            let data = []

            this._reqObj.on('data', (chunk) => {
                data.push(chunk)
            });

            this._reqObj.on('end', () => {
                try
                {
                    resolve(JSON.parse(data));
                }
                catch (e)
                {
                    reject({parser: e.message});
                }
            });

            this._reqObj.on('error', (err) => {
                reject(err);
            });
        });
    }
}