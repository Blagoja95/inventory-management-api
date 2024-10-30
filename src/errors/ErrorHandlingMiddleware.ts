import {Response, Request, NextFunction} from "express";
import {DefaultError} from "../types/ErrorTypes";

export default function errorHandling (error: DefaultError, req: Request, res: Response, next: NextFunction)
{
    if(error?.statusCode === 500 || process.env.PRINT_STACK === "1")
    {
        console.error(error.stack);
    }

    res.status(error.statusCode).json({error: error.message});
}