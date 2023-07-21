import express, { NextFunction, Request, Response, Router } from 'express';
import NumberLinkController from './numberLinkController';

const numberLinkRouter: Router = express.Router();

numberLinkRouter.post('/numberLink/next', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const width = Number(req.query['width']);
        const height = Number(req.query['height']);

        const response = await NumberLinkController.getQuestion(width, height);

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }

    next();
});

export default numberLinkRouter;
