const router = require("express").Router();

const inventoryController = new (require('../controller/InventoryController'))();

router
	.get('/v1/inventories/get/measurements/name/:name?', (req, res, next) =>
	{
		inventoryController.gt_msrmnts(req, res, next, "nm");
	})
	.get('/v1/inventories/get/measurements/symbol/:name?', (req, res, next) =>
	{
		inventoryController.gt_msrmnts(req, res, next, "symbol");
	})
	.get('/v1/inventories/get/measurements/count', (req, res, next) =>
	{
		inventoryController.gt_msrmnts_cnt(req, res, next);
	})
	.get('/v1/inventories/get/measurements/:id(\\d+)', (req, res, next) =>
	{
		inventoryController.gt_msrmnts(req, res, next);
	})
	.get('/v1/inventories/get/measurements', (req, res, next) =>
	{
		inventoryController.gt_ll_msrmnts(req, res, next);
	})
    .get('/v1/inventories/get/items/name*/:name?', (req, res, next) =>
    {
        inventoryController.gt_by_nm(req, res, next);
    })
    .get('/v1/inventories/get/items/count', (req, res, next) =>
    {
        inventoryController.gt_rtcls_cnt(req, res, next);
    })
    .get('/v1/inventories/get/items/:id(\\d+)', (req, res, next) =>
    {
        inventoryController.gt_byd(req, res, next);
    })
    .get('/v1/inventories/get/items', (req, res, next) =>
    {
        inventoryController.gt_ll(req, res, next);
    });

router
	.post('/v1/inventories/create/items', (req, res, next) =>
{
    inventoryController.crt_tm(req, res, next);
})
	.post('/v1/inventories/create/measurements', (req, res, next) =>
	{
		inventoryController.crt_msrmnt(req, res, next);
	});

router
	.delete('/v1/inventories/delete/measurements', (req, res, next) =>
	{
		inventoryController.dlt_msrmnts(req, res, next);
	})
	.delete('/v1/inventories/delete/items', (req, res, next) =>
	{
		inventoryController.dlt_tm(req, res, next);
	});

router.put('/v1/inventories/update', (req, res, next) =>
{
    inventoryController.pdt_tm(req, res, next);
});

module.exports = router;