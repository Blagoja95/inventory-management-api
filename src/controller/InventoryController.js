const DatabaseMiddleware = require("../database/DatabaseMiddleware");
module.exports = class InventoryController {
    _reqObj = null;
    _BARCODE_LENGTH = 12;
    _dbMiddleware = null;

    constructor(req) {
        if((!req || typeof req !== 'object'))
            throw new Error("Response object must be provided!");

        this._reqObj = req;
        this._dbMiddleware = new DatabaseMiddleware(process.env.DB_NAME);
    }

    async createUser(resHandlerObj)
    {
        try {
            const body = await this._getBody();

            if(!body['productName'] || typeof body.productName === 'string' || body.productName.length < 3)
            {
                return resHandlerObj.badRequest("name parameter value is missing or it is a empty string");
            }

            if (Object.keys(this._dbMiddleware.getItemByName(body.productName)).length !== 0)
            {
                return resHandlerObj.conflict('item ' + body.productName + ' already exists')
            }

            resHandlerObj.ok(JSON.stringify(body));
        }
        catch (e)
        {
            console.error(e)
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