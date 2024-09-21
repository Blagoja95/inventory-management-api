module.exports = class DatabaseMiddleware {
    path = '';
    _inMemoryJSON = null;
    _fs = require('node:fs');

    constructor(filePath)
    {
        if(typeof filePath !== "string" || filePath.length === 0 )
        {
            throw new Error("File path should be a string")
        }

        this.path = filePath;

        this._inMemoryJSON = this._fs.readFileSync(this.path, 'utf-8');
        this.parseInMemoryJSON = this._inMemoryJSON;
    }

    get allInventory()
    {
        return this._inMemoryJSON;
    }

    get count()
    {
        return Object.keys(this._parsedInMemoryJSON).length;
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
        return this.parsedInMemoryJSON[name] ?? {};
    }

    getItemById (id, withKey = false)
    {
        for (const key in this.parsedInMemoryJSON)
        {
            if(this.parsedInMemoryJSON[key].id === id)
            {
                return withKey ? {[key] : this.parsedInMemoryJSON[key]} : this.parsedInMemoryJSON[key];
            }
        }

        return -1;
    }

    createItem (name, object)
    {
        this._parsedInMemoryJSON[name] = object;

        return this._writeInDB();
    }

    _writeInDB()
    {
        this._inMemoryJSON = JSON.stringify(this._parsedInMemoryJSON);

        try
        {
            this._fs.writeFileSync(this.path, this._inMemoryJSON);
        }
        catch(e)
        {
            console.error(e);

            return -1;
        }

        return 1;
    }

    updateByName(name, key, value)
    {
        this._parsedInMemoryJSON[name][key] = value;

        const resStatus = this._writeInDB();

        return {
            status: resStatus,
            data: resStatus === 1 ? this.getItemByName(name) : null
        };
    }

    updateByID(id, key, value)
    {
        const ob = this.getItemById(id, true);
        let resStatus = -1;

        if (Object.keys(ob).length > 0)
        {
            this._parsedInMemoryJSON[Object.keys(ob)[0]][key] = value;

            resStatus = this._writeInDB();
        }

        return {
            status: resStatus,
            data: resStatus === 1 ? this._parsedInMemoryJSON[Object.keys(ob)[0]] : null
        };
    }

    deleteByName(name)
    {
        delete this._parsedInMemoryJSON[name];

        return this._writeInDB();
    }
}