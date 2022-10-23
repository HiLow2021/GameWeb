import express, { NextFunction, Request, Response, Router } from 'express';
import ConnectFourController from './connectFourController';

const connectFourRouter: Router = express.Router();

connectFourRouter.post('/connectFour/next', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const response = await ConnectFourController.getNext(req.body);

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }

    next();
});

export default connectFourRouter;
