import { OneStrokeWritingQuestionDto } from '../businessLogic/queries/oneStrokeWritingQuestionDto';
import { convertToOneStrokeWritingQuestionDto } from './converters/convertToOneStrokeWritingQuestionDto';
import prisma from './prisma';

export class OneStrokeWritingQuestionDao {
    public async getQuestionCount(width: number, height: number, straight: boolean): Promise<number> {
        const condition = { width, height, straight };
        const count = await prisma.gameOneStrokeWritingQuestion.count({
            where: condition
        });

        return count;
    }

    public async select(width: number, height: number, index: number, straight: boolean): Promise<OneStrokeWritingQuestionDto | undefined> {
        const condition = { width, height, straight };
        const questions = await prisma.gameOneStrokeWritingQuestion.findMany({
            take: 1,
            skip: index,
            where: condition
        });

        if (questions.length === 0) {
            return undefined;
        }

        return convertToOneStrokeWritingQuestionDto(questions[0]);
    }
}
