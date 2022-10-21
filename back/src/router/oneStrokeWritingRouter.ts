import express, { NextFunction, Request, Response, Router } from 'express';
import { RandomUtility } from 'shared/utility/randomUtility';
import prisma from '../prisma';

const oneStrokeWritingRouter: Router = express.Router();

type ResponseData = {
    cells: string[][];
};

oneStrokeWritingRouter.get('/oneStrokeWriting/question', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const width = Number(req.query['width']);
        const height = Number(req.query['height']);
        const straight = Boolean(req.query['straight']);

        const condition = { width, height, straight };
        const count = await prisma.gameOneStrokeWritingQuestion.count({
            where: condition
        });
        const question = await prisma.gameOneStrokeWritingQuestion.findMany({
            take: 1,
            skip: RandomUtility.random(0, count),
            where: condition
        });

        if (question.length === 0) {
            res.status(500).json({ result: 'question not found' });

            return;
        }

        const response = { cells: JSON.parse(question[0].cells) } as ResponseData;

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }

    next();
});

export default oneStrokeWritingRouter;
