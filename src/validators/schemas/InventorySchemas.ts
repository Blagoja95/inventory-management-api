import {z} from "zod";

export const barcode = z.object({
	id: z.string().length(12, 'Barcode [id] must be length of 12 digits')
});

export const measurement_param_id = z.object({
	id: z.string()
});

export const measurement_param_name = z.object({
	name: z.string({required_error: 'missing name parameter'}),
})

export const nvntry_req_bdy = z.object({
	productName: z.string({required_error: 'missing item name parameter'}).min(1, 'item name value must contain at least 1 character'),
	measurement_id: z.number({required_error: 'missing measurement id parameter', invalid_type_error: 'measurement id value must be number'}),
	quantity: z.string().optional(),
	price: z.number().nonnegative('price must be positive number value. example: 5.11').optional(),
	description: z.string().optional()
});