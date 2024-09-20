const DatabaseMiddleware = require('../database/DatabaseMiddleware');
const e = require("express");

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
        if(req?.params?.id === undefined)
        {
            // missing param
        }

        if(Number.isInteger(parseInt(req.params.id)))
        {
            // must be proper barcode number
        }

        res.status(200).json(this._dbMiddleware.getItemById(req.params.id));
    }

    getByName(req, res)
    {
        res.status(200).json(this._dbMiddleware.getItemByName(req.params.name));
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
            res.status(400).json({ info: 'name parameter value is missing or it is a empty string'});
        }

        if (Object.keys(this._dbMiddleware.getItemByName(body.productName)).length !== 0)
        {
            res.status(409).json({info: 'item ' + body.productName + ' already exists'})
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
    }

     updateItem(req, res)
    {
        const {body} = req;
        let result;

        if(!body['productName'] || typeof body.productName !== 'string' || body.productName.length < 3)
        {
            if(!body['id'] || typeof body.id !== 'string' || body.id.length < 12)
            {
                res.status(400).json({info: 'provide either product name value or barcode [id] value'});
            }

            if(!body['key'] || !body['value'])
            {
                res.status(400).json({info: "key or value of desired update parameters is missing"});
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
                res.status(400).json({info: 'provide either product name value or barcode [id] value'});
            }

            const item = Object.keys(this._dbMiddleware.getItemById(body.id, true));

            if (item.length === 0)
            {
                res.status(409).json({info: 'item with barcode [id]: ' + body.id + ' does not exists'});
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
                res.status(409).json({info: 'item ' + body.productName + ' does not exists'});
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