const DatabaseMiddleware = require('./database/DatabaseMiddleware');
const ResponseHandler = require('./handlers/ResponseHandler');
const InventoryController = require('./controller/InventoryController')

const {createServer} = require('node:http');
const dotenv = require('dotenv')
    .config();

const HOSTNAME = process.env.NODE_HOSTNAME || '127.0.0.1';
const PORT = process.env.NODE_PORT || 5000;
const dbMw = new DatabaseMiddleware(process.env.DB_NAME);

const server = createServer(async (req, res) => {
    const resHandler = new ResponseHandler(res);
    const url = req.url.split('/');

    url.shift();

    switch (url[0]) {
        case 'inventories':
            const invCntrl = new InventoryController(req);

            if (req.method === 'GET') {
                if (Number.isInteger(parseInt(url[1])))
                {
                    resHandler.ok(JSON.stringify(dbMw.getItemById(url[1])));
                }
                else if (url[1] === undefined || url[1] === '')
                {
                    resHandler.ok(dbMw.allInventory);
                }
                else if (url[1] === 'count')
                {
                    resHandler.ok(JSON.stringify({inventory_articles: dbMw.count}));
                }
                else if (url[1] === 'name')
                    {
                        if(typeof url[2] === 'string' && url[2].length > 3)
                        {
                            resHandler.ok(JSON.stringify(dbMw.getItemByName(url[2])));
                        }
                        else
                        {
                            resHandler.badRequest('name value empty or too short');
                        }

                    }
                else
                {
                    resHandler.notFound();
                }

            } else if (url[1] === 'create' && req.method === 'POST')
            {
              await invCntrl.createUser(resHandler);
            }
            else if (req.method === 'PATCH')
            {

            } else if (req.method === 'DELETE') {

            }


        default:
            resHandler.notFound();

            break;
    }
});

server.listen(PORT, HOSTNAME, () => console.info(`Server listening on: http://${HOSTNAME}:${PORT}`));