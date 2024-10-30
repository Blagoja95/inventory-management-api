import DefaultError from "./DefaultError";
import {DatabaseError} from 'pg'

export class DbError extends DefaultError
{
	constructor(e: DatabaseError, statusCode: number = 400)
	{
		super(e.detail || 'something went wrong', statusCode);

		console.log(e);
	}
}