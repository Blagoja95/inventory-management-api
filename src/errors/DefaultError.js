module.exports = class DefaultError extends Error
{
    constructor(message, statusCode) {
        super(message || 'Something went wrong');
        this.statusCode = statusCode || 500;
    }
}