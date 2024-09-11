const DatabaseMiddleware = require('../database/DatabaseMiddleware');
module.exports = class InventoryController {
    _reqObj = null;
    _BARCODE_LENGTH = 12;
    _dbMiddleware = null;

    constructor(req) {
        if((!req || typeof req !== 'object'))
            throw new Error('Response object must be provided!');

        this._reqObj = req;
        this._dbMiddleware = new DatabaseMiddleware(process.env.DB_NAME);
    }

    async createItem(resHandlerObj)
    {
        try {
            const body = await this._getBody();

            if(!body['productName'] || typeof body.productName !== 'string' || body.productName.length < 3)
            {
                return resHandlerObj.badRequest('name parameter value is missing or it is a empty string');
            }

            if (Object.keys(this._dbMiddleware.getItemByName(body.productName)).length !== 0)
            {
                return resHandlerObj.conflict('item ' + body.productName + ' already exists')
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

            if(this._dbMiddleware.createItem(body.productName, itemBody) === 1)
            {
                return resHandlerObj.ok(JSON.stringify(itemBody));
            }

            resHandlerObj.internalServerError('something went wrong');
        }
        catch (e)
        {
            console.error(e)
        }
    }

    async updateItem(resHandlerObj)
    {
        let res = null;

        try
        {
            const body = await this._getBody();

            if(!body['productName'] || typeof body.productName !== 'string' || body.productName.length < 3)
            {
                if(!body['id'] || typeof body.id !== 'string' || body.id.length < 12)
                {
                    return resHandlerObj.badRequest('provide either product name value or barcode [id] value');
                }

                if(!body['key'] || !body['value'])
                {
                    return resHandlerObj.badRequest("key or value of desired update parameters is missing");
                }

                res = await this._dbMiddleware.updateByID(body.id, body.key, body.value);
            }
            else
            {
                res = this._dbMiddleware.updateByName(body.productName, body.key, body.value);
            }

            if(res.status === 1)
            {
                return resHandlerObj.ok(JSON.stringify(res.data));
            }
            //TODO: other cases

            resHandlerObj.internalServerError('something went wrong');
        }
        catch (e)
        {
            console.error(e);
        }
    }

    async deleteItem(resHandlerObj)
    {
        try
        {
            const body = await this._getBody();

            if(!body['productName'] || typeof body.productName !== 'string' || body.productName.length < 3)
            {
                return resHandlerObj.badRequest('name parameter value is missing or it is a empty string');
            }

            // TODO: delete by barcode id

            if (Object.keys(this._dbMiddleware.getItemByName(body.productName)).length === 0)
            {
                return resHandlerObj.badRequest('item ' + body.productName + ' does not exists')
            }

            if(this._dbMiddleware.deleteByName(body.productName) === 1)
            {
                return resHandlerObj.ok(JSON.stringify({info: 'Item by name ' + body.productName + ' is now deleted' }));
            }

            resHandlerObj.internalServerError('something went wrong');
        }
        catch (e)
        {
            console.error(e);
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