import { Router, Request, Response, NextFunction } from 'express';
const rt2 = Router();

rt2.get('/v1/documentation', (req: Request, res: Response, next: NextFunction) =>
{
	res.status(301).redirect(process.env.NODE_DOC_URL || '');
});

export default rt2;