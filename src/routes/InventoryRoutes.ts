import InventoryController from "../controller/InventoryController";
import { Router, Request } from 'express';
import {InventoryReqBody} from "../types/InventoryTypes";

const rt = Router();

const inventoryController = new InventoryController();

rt
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
    .get('/v1/inventories/get/items/name/:name?', (req, res, next) =>
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

rt
	.post('/v1/inventories/create/items', (req: Request<{}, {}, InventoryReqBody>, res, next) =>
{
    inventoryController.crt_tm(req, res, next);
})
	.post('/v1/inventories/create/measurements', (req, res, next) =>
	{
		inventoryController.crt_msrmnt(req, res, next);
	});

rt
	.delete('/v1/inventories/delete/measurements', (req, res, next) =>
	{
		inventoryController.dlt_msrmnts(req, res, next);
	})
	.delete('/v1/inventories/delete/items', (req, res, next) =>
	{
		inventoryController.dlt_tm(req, res, next);
	});

rt.put('/v1/inventories/update', (req, res, next) =>
{
    inventoryController.pdt_tm(req, res, next);
});

export default rt;