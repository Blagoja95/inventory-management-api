module.exports = class DefaultError extends Error
{
	public statusCode: number;

    constructor(message :string, statusCode :number)
	{
        super(message || 'Something went wrong');

		this.statusCode = statusCode || 500;
    }
}