import fs from 'fs/promises';
import { NumberLinkQuestionDto } from '../businessLogic/queries/numberLinkQuestionDto';
import { NumberLinkQuestion } from './models/numberLinkQuestion';

export class NumberLinkQuestionJsonDao {
    private readonly _path: string = '../db/json/number-link-question.json';

    public async getQuestionCount(width: number, height: number): Promise<number> {
        const questions = await this.getQuestions(width, height);

        return questions.length;
    }

    public async select(width: number, height: number, index: number): Promise<NumberLinkQuestionDto | undefined> {
        const questions = await this.getQuestions(width, height);
        if (questions.length <= index) {
            return undefined;
        }

        return questions[index].question.map((x, i) =>
            x.map((y, j) => ({
                id: i * x.length + j,
                x: j,
                y: i,
                number: y ? y : undefined,
                routes: []
            }))
        );
    }

    private async getQuestions(width: number, height: number): Promise<NumberLinkQuestion[]> {
        const jsonString = await fs.readFile(this._path, 'utf8');
        const questions: NumberLinkQuestion[] = JSON.parse(jsonString);

        return questions.filter((question) => question.width === width && question.height === height);
    }
}
