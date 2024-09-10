module.exports = class ResponseHandler {
    _resObj = null;

    constructor(resObj) {
        if((!resObj || typeof resObj !== 'object'))
            throw new Error("Response object must be provided!");

        this._resObj = resObj;
    }

    ok (data)
    {
        this._resObj.statusCode = 200;
        this._resObj.setHeader('Content-Type', 'application/json')
        this._resObj.end(data);
    }

    badRequest(msg)
    {
        this._resObj.statusCode = 400;
        this._resObj.setHeader('Content-Type', 'application/json')
        this._resObj.end(JSON.stringify({info : msg}));
    }

    notFound()
    {
        this._resObj.statusCode = 404;
        this._resObj.end();
    }

    internalServerError(msg)
    {
        this._resObj.statusCode = 500;
        this._resObj.setHeader('Content-Type', 'application/json')
        this._resObj.end(JSON.stringify({info : msg}));
    }
}