import express, { NextFunction, Request, Response, Router } from 'express';

const pingRouter: Router = express.Router();

pingRouter.get('/ping', (_: Request, res: Response, next: NextFunction): void => {
    try {
        res.status(200).send();
    } catch (error) {
        next(error);
    }

    next();
});

export default pingRouter;
