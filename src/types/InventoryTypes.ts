import {QueryResult} from "pg";

export type CallbackFunction = (error: Error, response: QueryResult) => void;

export interface InventoryItem {
	id: string
	name: string
	quantity: number
	price: number
	measurement: number
	description: string
}

export type InventoryReqBody = {
	productName: string
	measurement_id: number
	quantity?:number
	price?: number
	description?: string
}

export type MeasurementReqBody = {
	body: {
		measurementName: string
		symbol: string
	}
}
