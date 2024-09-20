const express = require('express');
const dotenv = require('dotenv')
    .config();

const HOSTNAME = process.env.NODE_HOSTNAME || '127.0.0.1';
const PORT = process.env.NODE_PORT || 5000;

const app = express();
const inventoryController = new (require('./controller/InventoryController'))();

app.use(express.json());

app
    .get('/v1/inventories/name/:name', (req, res, next) =>
    {
        inventoryController.getByName(req, res);
    })
    .get('/v1/inventories/count', (req, res, next) =>
    {
        inventoryController.getItemsCount(req, res);
    })
    .get('/v1/inventories/:id', (req, res, next) =>
    {
        inventoryController.getById(req, res);
    })
    .get('/v1/inventories/', (req, res, next) =>
    {
        inventoryController.getAll(req, res);
    });

app.post('/v1/inventories/create', (req, res, next) =>
{
    inventoryController.createItem(req, res);
});

app.delete('/v1/inventories/delete/', (req, res, next) =>
{
    inventoryController.deleteItem(req, res);
});

app.put('/v1/inventories/update', (req, res, next) =>
{
    inventoryController.updateItem(req, res);
});

app.use((req, res, next) =>
{
    res.status(404).json({ error: 'Not Found', message: 'The requested URL was not found on the server' });
});

app.use((err, req, res, next) =>
{
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error', message: 'Something went wrong!' });
});

app.listen(PORT, HOSTNAME, () => console.info(`Server listening on: http://${HOSTNAME}:${PORT}`));