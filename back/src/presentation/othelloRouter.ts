import express, { NextFunction, Request, Response, Router } from 'express';
import OthelloController from './othelloController';

const othelloRouter: Router = express.Router();

othelloRouter.post('/othello/next', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const response = await OthelloController.getNext(req.body);

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }

    next();
});

export default othelloRouter;
