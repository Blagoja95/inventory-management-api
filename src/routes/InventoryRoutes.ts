import { Router, Request } from 'express';
import {
	gt_byd_cntrl,
	gt_cnt_cntrl,
	gt_ll_cntrl,
	prp_msrmnts_cntrl
} from '../controller/InventoryController';
import {InventoryReqBody} from '../types/InventoryTypes';
import {validateData} from '../validators/BaseValidator';
import {barcode, measurement_param_id, measurement_param_name} from '../validators/schemas/InventorySchemas';
import {gt_byd_db, gt_ll_db} from '../database/inventory/InventoryDatabase';
import {cnt_db, db_wrppr, fndrw} from '../database/BaseDatabase';

const rt = Router();

rt
	.get('/v1/inventories/get/measurements/name/:name?',
		validateData(measurement_param_name, true),
		prp_msrmnts_cntrl('nm'),
		fndrw,
		db_wrppr,
		gt_ll_cntrl)

	.get('/v1/inventories/get/measurements/symbol/:name?',
		validateData(measurement_param_name, true),
		prp_msrmnts_cntrl('symbol'),
		fndrw,
		db_wrppr,
		gt_ll_cntrl)

	.get('/v1/inventories/get/measurements/count', cnt_db('measurements'), db_wrppr, gt_cnt_cntrl)

	.get('/v1/inventories/get/measurements/:id',
		validateData(measurement_param_id, true),
		prp_msrmnts_cntrl('id'),
		fndrw,
		db_wrppr,
		gt_ll_cntrl)

	.get('/v1/inventories/get/measurements', gt_ll_db, db_wrppr,  gt_ll_cntrl) // TODO pagination
    .get('/v1/inventories/get/items/name/:name?') // TODO pagination

    .get('/v1/inventories/get/items/count', cnt_db('articles'), db_wrppr, gt_cnt_cntrl)

    .get('/v1/inventories/get/items/:id', validateData(barcode, true), gt_byd_db, db_wrppr, gt_byd_cntrl)

    .get('/v1/inventories/get/items', gt_ll_db, db_wrppr,  gt_ll_cntrl); // TODO pagination

rt
	.post('/v1/inventories/create/items',)
	.post('/v1/inventories/create/measurements', (req, res, next) =>
	{
		// inventoryController.crt_msrmnt(req, res, next);
	});

rt
	.delete('/v1/inventories/delete/measurements', (req, res, next) =>
	{
		// inventoryController.dlt_msrmnts(req, res, next);
	})
	.delete('/v1/inventories/delete/items', (req, res, next) =>
	{
		// inventoryController.dlt_tm(req, res, next);
	});

rt.put('/v1/inventories/update'); // TODO update

export default rt;