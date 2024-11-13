export interface Statement {
    q: string,
    prmtrs?: Array<any>
}

export interface Count_Response_Body {
    inventory_count?: number,
    measurements_count?: number
}

export interface Update {
    ky: string,
    vl: any,
	id?: string
    cl?: string,
    cl_vl?: any,
	tb?: string
}