import express, { NextFunction, Request, Response, Router } from 'express';
import IllustrationLogicController from './illustrationLogicController';

const illustrationLogicRouter: Router = express.Router();

illustrationLogicRouter.get('/illustrationLogic/question', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const width = Number(req.query['width']);
        const height = Number(req.query['height']);

        const response = await IllustrationLogicController.getQuestion(width, height);

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }

    next();
});

export default illustrationLogicRouter;
