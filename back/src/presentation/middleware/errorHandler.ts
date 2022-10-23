import { NextFunction, Request, Response } from 'express';
import { ResultCode } from '../enums/resultCode';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: Error, _: Request, res: Response, __: NextFunction): void => {
    console.error(err);
    res.status(500).json({
        code: ResultCode.Failed,
        message: err.message
    });
};

export default errorHandler;
