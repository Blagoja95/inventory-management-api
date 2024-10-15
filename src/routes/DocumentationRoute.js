const router = require("express").Router();

router.get('/v1/documentation', (req, res, next) =>
{
	res.status(301).redirect(process.env.NODE_DOC_URL);
});

module.exports = router;