import fs from 'fs/promises';
import { IllustrationLogicQuestionDto } from '../businessLogic/queries/illustrationLogicQuestionDto';
import { IllustrationLogicQuestion } from './models/illustrationLogicQuestion';
import { IllustrationLogicBoardCell } from 'shared/game/illustrationLogic/enums/illustrationLogicBoardCell';

export class IllustrationLogicQuestionJsonDao {
    private readonly _path: string = '../db/json/illustration-logic-question.json';

    public async getQuestionCount(width: number, height: number): Promise<number> {
        const questions = await this.getQuestions(width, height);

        return questions.length;
    }

    public async select(width: number, height: number, index: number): Promise<IllustrationLogicQuestionDto | undefined> {
        const questions = await this.getQuestions(width, height);
        if (questions.length <= index) {
            return undefined;
        }

        return {
            title: questions[index].title,
            cells: questions[index].answer.map((x) =>
                x.map((y) => (y === 1 ? IllustrationLogicBoardCell.On : IllustrationLogicBoardCell.Off))
            )
        };
    }

    private async getQuestions(width: number, height: number): Promise<IllustrationLogicQuestion[]> {
        const jsonString = await fs.readFile(this._path, 'utf8');
        const questions: IllustrationLogicQuestion[] = JSON.parse(jsonString);

        return questions.filter((question) => question.width === width && question.height === height);
    }
}
