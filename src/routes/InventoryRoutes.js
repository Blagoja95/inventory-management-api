const router = require("express").Router();

const inventoryController = new (require('../controller/InventoryController'))();

router
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

router.post('/v1/inventories/create', (req, res, next) =>
{
    inventoryController.createItem(req, res);
});

router.delete('/v1/inventories/delete/', (req, res, next) =>
{
    inventoryController.deleteItem(req, res);
});

router.put('/v1/inventories/update', (req, res, next) =>
{
    inventoryController.updateItem(req, res);
});

module.exports = router;