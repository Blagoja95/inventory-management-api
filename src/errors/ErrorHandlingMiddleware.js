module.exports = errorHandling = (error, req, res, next) =>
{
    if(error?.status === 500 || process.env.PRINT_STACK === "1")
    {
        console.error(error.stack);
    }

    res.status(error.statusCode).json({error: error.message});
}