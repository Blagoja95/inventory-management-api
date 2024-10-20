import { Router } from 'express';
const rt2 = Router();

rt2.get('/v1/documentation', (req, res, next) =>
{
	res.status(301).redirect(process.env.NODE_DOC_URL || '');
});

export default rt2;