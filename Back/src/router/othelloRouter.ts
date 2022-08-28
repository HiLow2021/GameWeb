import express, { NextFunction, Request, Response, Router } from 'express';

const othelloRouter: Router = express.Router();

othelloRouter.post('/othello/next', (req: Request, res: Response, next: NextFunction): void => {
    try {
        res.status(200).json({ text: 'next method Success!!' });
    } catch (error) {
        next(error);
    }
});

export default othelloRouter;
