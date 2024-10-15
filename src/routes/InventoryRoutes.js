const router = require("express").Router();

const inventoryController = new (require('../controller/InventoryController'))();

router
	.get('/v1/inventories/measurements/name/:name', (req, res, next) =>
	{
		inventoryController.gt_msrmnts(req, res, next, "nm");
	})
	.get('/v1/inventories/measurements/symbol/:name', (req, res, next) =>
	{
		inventoryController.gt_msrmnts(req, res, next, "symbol");
	})
	.get('/v1/inventories/measurements/count', (req, res, next) =>
	{
		inventoryController.gt_msrmnts_cnt(req, res, next);
	})
	.get('/v1/inventories/measurements/:id(\\d+)', (req, res, next) =>
	{
		inventoryController.gt_msrmnts(req, res, next);
	})
	.get('/v1/inventories/measurements', (req, res, next) =>
	{
		inventoryController.gt_ll_msrmnts(req, res, next);
	})
    .get('/v1/inventories/name/:name', (req, res, next) =>
    {
        inventoryController.gt_by_nm(req, res, next);
    })
    .get('/v1/inventories/count', (req, res, next) =>
    {
        inventoryController.gt_rtcls_cnt(req, res, next);
    })
    .get('/v1/inventories/:id(\\d+)', (req, res, next) =>
    {
        inventoryController.gt_byd(req, res, next);
    })
    .get('/v1/inventories/', (req, res, next) =>
    {
        inventoryController.gt_ll(req, res, next);
    });

router
	.post('/v1/inventories/create', (req, res, next) =>
{
    inventoryController.crt_tm(req, res, next);
})
	.post('/v1/inventories/create/measurements', (req, res, next) =>
	{
		inventoryController.crt_msrmnt(req, res, next);
	});

router.delete('/v1/inventories/delete/', (req, res, next) =>
{
    inventoryController.dlt_tm(req, res, next);
});

router.put('/v1/inventories/update', (req, res, next) =>
{
    inventoryController.pdt_tm(req, res, next);
});

module.exports = router;