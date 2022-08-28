import { NextFunction, Request, Response } from 'express';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: Error, req: Request, res: Response, _: NextFunction): void => {
    console.error(err);
    res.status(500).send(err.message);
};

export default errorHandler;
