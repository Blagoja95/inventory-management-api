import {z} from "zod";

export const barcode = z.object({
	id: z.string({required_error: 'Barcode [id] parameter is missing'}).length(12, 'Barcode [id] must be length of 12 digits')
});

export const measurement_param_id = z.object({
	id: z.string()
});

export const measurement_param_name = z.object({
	name: z.string({required_error: 'missing name parameter'}),
})

export const nvntry_rq_bdy = z.object({
	productName: z.string({required_error: 'missing product name parameter'}).min(1, 'item name value must contain at least 1 character'),
	measurement_id: z.number({required_error: 'missing measurement id parameter', invalid_type_error: 'measurement id value must be number'}),
	quantity: z.number().optional(),
	price: z.number().nonnegative('price must be positive number value. example: 5.11').optional(),
	description: z.string().optional(),
});

export const msrmnt_rq_bdy = z.object({
	measurementName: z.string({required_error: 'missing measurement name parameter'}).min(1, 'measurement name value must contain at least 1 character'),
	symbol: z.string({required_error: 'missing symbol name parameter'}).min(1, 'symbol name value must contain at least 1 character')
});

export const pgntn_tms_qry  = z.object({
	cursor: z.string().default('0'),
	limit: z.enum(['5', '10', '15', '25', '50']).default('10'),
	order_by: z.enum(['id', 'name', 'price']).default('id'),
	order: z.enum(['ASC', 'DESC']).default('ASC')
});