import {Request, Response, NextFunction} from 'express';
import {ZodError, AnyZodObject, ZodSchema} from 'zod';
import DefaultError from "../errors/DefaultError";

export const validateData = (schema: ZodSchema<any>, params:boolean = false) =>
{
	return (req: Request, res: Response, next: NextFunction) =>
	{
		try
		{
			schema.parse(params ? req.params : req.body);

			next();

		} catch (e)
		{
			if (e instanceof ZodError)
			{
				next(new DefaultError(e.errors[0].message, 400));

				return;
			}

			next(e);
		}
	}
}

export const vldt_pgntn_tms = (shema: ZodSchema<any>) =>
{
	return (req: Request, res: Response, next: NextFunction) =>
	{
		const q = shema.safeParse(req.query);

		if (!q.success)
		{
			throw new DefaultError(q.error.errors[0].message ?? 'Bad request', 400);
		}

		res.locals.data = q.data;

		next();
	}
}