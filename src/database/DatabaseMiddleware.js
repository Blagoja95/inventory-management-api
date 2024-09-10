module.exports = class DatabaseMiddleware {
    path = '';
    _inMemoryJSON = null;

    constructor(filePath)
    {
        if(typeof filePath !== "string" || filePath.length === 0 )
        {
            throw new Error("File path should be a string")
        }

        this.path = filePath;

        this._inMemoryJSON = require('node:fs').readFileSync(this.path, 'utf-8');
        this.parseInMemoryJSON = this._inMemoryJSON;
    }

    get allInventory()
    {
        return this._inMemoryJSON;
    }

    get count()
    {
        return Object.keys().length;
    }

    set parseInMemoryJSON(obj)
    {
        this._parsedInMemoryJSON = JSON.parse(obj);

    }

    get parsedInMemoryJSON()
    {
        return this._parsedInMemoryJSON;
    }


    getItemByName (name)
    {
        if(typeof name !== 'string')
        {
            return {info: "search value must be string"};
        }

        return this.parsedInMemoryJSON[name] ?? {};
    }

    getItemById (id)
    {
        for (const key in this.parsedInMemoryJSON)
        {
            if(this.parsedInMemoryJSON[key].id === id)
            {
                return this.parsedInMemoryJSON[key];
            }
        }

        return {};
    }
}