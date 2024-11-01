export type MeasurementReqBody = {
	body: {
		measurementName: string
		symbol: string
	}
}

export interface pgntn_rspns_bdy {
	records:  Array<any>,
	cursor: string,
	size: number,
	records_count: number
}