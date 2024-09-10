module.exports = class InventoryController {
    _reqObj = null;

    constructor(req) {
        if((!req || typeof req !== 'object'))
            throw new Error("Response object must be provided!");

        this._reqObj = req;
    }

     async createUser(resHandlerObj)
    {

        try {
            const body = await this._getBody();

            resHandlerObj.badRequest(body.name)
        }
        catch (e)
        {
            if(e['parser'])
                resHandlerObj.badRequest('request parameters are empty');
            else
                resHandlerObj.internalServerError(e.message);
        }
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