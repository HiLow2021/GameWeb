import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: Error, _: Request, res: Response, next: NextFunction): void => {
    console.error(err);
    res.status(500).send(err.message);

    next(err);
};

export default errorHandler;
