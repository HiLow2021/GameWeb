import express, { NextFunction, Request, Response, Router } from 'express';
import GomokuController from './gomokuController';

const gomokuRouter: Router = express.Router();

gomokuRouter.post('/gomoku/next', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const response = await GomokuController.getNext(req.body);

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }

    next();
});

export default gomokuRouter;
