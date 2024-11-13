import { Router} from 'express';
import {
	dlt_rspon_cntrl, gt_byd_cntrl, gt_cnt_cntrl, gt_ll_cntrl,
	prp_msrmnts_cntrl, prpr_tm_bdy, hndl_pgntn_rspns_cntrl, pdt_tms_cntrl
} from '../controller/InventoryController';

import {validateData, vldt_pgntn_tms} from '../validators/BaseValidator';

import {
	barcode, dscrptn_bdy, measurement_param_id, measurement_param_name, msrmnt_rq_bdy, nm_bdy, nm_msrmnt_bdy,
	nvntry_rq_bdy, pgntn_msrmnts_qry, pgntn_tms_qry, prc_bdy
} from '../validators/schemas/InventorySchemas';

import {crt_msurmnt, crttm, gt_byd_db, gt_ll_db, gt_ll_msrmnts_db} from '../database/inventory/InventoryDatabase';
import {cnt_db, db_wrppr, dlt_gnrc, pdty_rsrc_db} from '../database/BaseDatabase';

const rt = Router();

rt.get('/v1/inventories/get/measurements/name/:name?',
		validateData(measurement_param_name, true),
		prp_msrmnts_cntrl('nm'),
		db_wrppr,
		gt_ll_cntrl)

	.get('/v1/inventories/get/measurements/symbol/:name?',
		validateData(measurement_param_name, true),
		prp_msrmnts_cntrl('symbol'),
		db_wrppr,
		gt_ll_cntrl)

	.get('/v1/inventories/get/measurements/count',
		cnt_db('measurements'),
		db_wrppr,
		gt_cnt_cntrl)

	.get('/v1/inventories/get/measurements/:id',
		validateData(measurement_param_id, true),
		prp_msrmnts_cntrl('id'),
		db_wrppr,
		gt_ll_cntrl)

	.get('/v1/inventories/get/measurements', vldt_pgntn_tms(pgntn_msrmnts_qry),
		gt_ll_msrmnts_db,
		db_wrppr,
		hndl_pgntn_rspns_cntrl) // TODO pagination

	.get('/v1/inventories/get/items/name/:name?', vldt_pgntn_tms(pgntn_tms_qry)) // TODO pagination

    .get('/v1/inventories/get/items/count',
		cnt_db('articles'),
		db_wrppr,
		gt_cnt_cntrl)

    .get('/v1/inventories/get/items/:id',
		validateData(barcode, true),
		gt_byd_db,
		db_wrppr,
		gt_byd_cntrl)

    .get('/v1/inventories/get/items',
		vldt_pgntn_tms(pgntn_tms_qry),
		gt_ll_db,
		db_wrppr,
		hndl_pgntn_rspns_cntrl);

rt.post('/v1/inventories/create/items',
	validateData(nvntry_rq_bdy),
	prpr_tm_bdy,
	crttm,
	db_wrppr,
	gt_ll_cntrl)

	.post('/v1/inventories/create/measurements',
		validateData(msrmnt_rq_bdy),
		crt_msurmnt,
		db_wrppr,
		gt_ll_cntrl);

rt.delete('/v1/inventories/delete/measurements/:id',
		validateData(measurement_param_id, true),
		dlt_gnrc('measurements'),
		db_wrppr,
		dlt_rspon_cntrl)

	.delete('/v1/inventories/delete/items/:id',
		validateData(barcode, true),
		dlt_gnrc('articles'),
		db_wrppr,
		dlt_rspon_cntrl);

rt.patch('/v1/inventories/update/items/price',
	validateData(prc_bdy),
	pdt_tms_cntrl('price'),
	pdty_rsrc_db,
	db_wrppr,
	gt_ll_cntrl)

.patch('/v1/inventories/update/items/description',
	validateData(dscrptn_bdy),
	pdt_tms_cntrl('description'),
	pdty_rsrc_db,
	db_wrppr,
	gt_ll_cntrl)

.patch('/v1/inventories/update/items/name',
	validateData(nm_bdy),
	pdt_tms_cntrl('name'),
	pdty_rsrc_db,
	db_wrppr,
	gt_ll_cntrl)
.patch('/v1/inventories/update/items/quantity')

.patch('/v1/inventories/update/measurement/name',
	validateData(nm_msrmnt_bdy),
	pdt_tms_cntrl('symbol'),
	pdty_rsrc_db,
	db_wrppr,
	gt_ll_cntrl)

.patch('/v1/inventories/update/measurement/symbol',
	validateData(nm_msrmnt_bdy),
	pdt_tms_cntrl('symbol'),
	pdty_rsrc_db,
	db_wrppr,
	gt_ll_cntrl);

export default rt;