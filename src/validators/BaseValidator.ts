import {Request, Response, NextFunction} from 'express';
import {ZodError, AnyZodObject} from 'zod';
import DefaultError from "../errors/DefaultError";

export const validateData = (schema: AnyZodObject, params:boolean = false) =>
{
	return (req: Request, res: Response, next: NextFunction) =>
	{
		try
		{
			schema.parse(params ? req.params : req.body);

			next();

		} catch (e)
		{
			console.log(e)
			if (e instanceof ZodError)
			{
				next(new DefaultError(e.errors[0].message, 400));

				return;
			}

			next(e);
		}
	}
}