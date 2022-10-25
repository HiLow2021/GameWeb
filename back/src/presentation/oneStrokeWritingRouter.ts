import express, { NextFunction, Request, Response, Router } from 'express';
import OneStrokeWritingController from './oneStrokeWritingController';

const oneStrokeWritingRouter: Router = express.Router();

oneStrokeWritingRouter.get('/oneStrokeWriting/question', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const width = Number(req.query['width']);
        const height = Number(req.query['height']);
        const straight = Boolean(req.query['straight']);

        const response = await OneStrokeWritingController.getQuestion(width, height, straight);

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }

    next();
});

export default oneStrokeWritingRouter;
