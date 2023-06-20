import fs from 'fs/promises';
import { OneStrokeWritingQuestionDto } from '../businessLogic/queries/oneStrokeWritingQuestionDto';
import { GameOneStrokeWritingQuestion } from './models/gameOneStrokeWritingQuestion';

export class OneStrokeWritingQuestionJsonDao {
    private readonly _path: string = '../db/json/one-stroke-writing-question.json';

    public async getQuestionCount(width: number, height: number, straight: boolean): Promise<number> {
        const questions = await this.getQuestions(width, height, straight);

        return questions.length;
    }

    public async select(width: number, height: number, index: number, straight: boolean): Promise<OneStrokeWritingQuestionDto | undefined> {
        const questions = await this.getQuestions(width, height, straight);
        if (questions.length <= index) {
            return undefined;
        }

        return questions[index].cells;
    }

    private async getQuestions(width: number, height: number, straight: boolean): Promise<GameOneStrokeWritingQuestion[]> {
        const jsonString = await fs.readFile(this._path, 'utf8');
        const questions: GameOneStrokeWritingQuestion[] = JSON.parse(jsonString);

        return questions.filter((question) => question.width === width && question.height === height && question.straight === straight);
    }
}
