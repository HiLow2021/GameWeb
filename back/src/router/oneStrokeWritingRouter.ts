import express, { NextFunction, Request, Response, Router } from 'express';
import { OneStrokeWritingBoardCell } from 'shared/game/oneStrokeWriting/enum/oneStrokeWritingBoardCell';
import { ArrayUtility } from 'shared/utility/arrayUtility';
import { RandomUtility } from 'shared/utility/randomUtility';
import prisma from '../prisma';

const oneStrokeWritingRouter: Router = express.Router();

type ResponseData = {
    cells: OneStrokeWritingBoardCell[][];
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

        const cells = randomTransformation(JSON.parse(question[0].cells));
        const response = { cells } as ResponseData;

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }

    next();
});

function randomTransformation(source: OneStrokeWritingBoardCell[][]): OneStrokeWritingBoardCell[][] {
    let result = ArrayUtility.create2Array<OneStrokeWritingBoardCell>(source[0].length, source.length);
    ArrayUtility.copy2Array(source, result);

    const rotate = RandomUtility.random(0, 4);
    switch (rotate) {
        case 0:
            result = ArrayUtility.rotate90(result);
            break;

        case 1:
            result = ArrayUtility.rotate180(result);
            break;

        case 2:
            result = ArrayUtility.rotate270(result);
            break;

        default:
            break;
    }

    const transpose = RandomUtility.random(0, 2);
    switch (transpose) {
        case 0:
            result = ArrayUtility.transpose(result);
            break;

        default:
            break;
    }

    return result;
}

export default oneStrokeWritingRouter;
