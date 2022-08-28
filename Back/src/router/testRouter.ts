import express, { NextFunction, Request, Response, Router } from 'express';

const testRouter: Router = express.Router();

testRouter.get('/test', (_: Request, res: Response, next: NextFunction): void => {
    try {
        res.status(200).json({ text: 'API Success!!' });
    } catch (error) {
        next(error);
    }
});

testRouter.get('/test/error', (_: Request, __: Response, next: NextFunction): void => {
    try {
        throw new Error('Error Handling Test Success!!');
    } catch (error) {
        next(error);
    }
});

export default testRouter;
