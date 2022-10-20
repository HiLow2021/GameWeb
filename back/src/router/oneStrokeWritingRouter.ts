import { PrismaClient } from '@prisma/client';
import express, { NextFunction, Request, Response, Router } from 'express';

const oneStrokeWritingRouter: Router = express.Router();
const prisma = new PrismaClient();

type ResponseData = {
    cells: string[][];
};

oneStrokeWritingRouter.get('/oneStrokeWriting/question', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const width = Number(req.query['width']);
        const height = Number(req.query['height']);
        const straight = Boolean(req.query['straight']);

        const question = await prisma.t_game_one_stroke_writing_question.findFirst({
            where: {
                width,
                height,
                straight
            }
        });

        if (!question) {
            res.status(500).json({ result: 'question nothing' });

            return;
        }

        const response = { cells: JSON.parse(question.cells) } as ResponseData;

        res.status(200).json(response);
    } catch (error) {
        next(error);
    } finally {
        await prisma.$disconnect();
    }

    next();
});

export default oneStrokeWritingRouter;
