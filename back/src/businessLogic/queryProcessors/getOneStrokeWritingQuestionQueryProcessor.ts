import { RandomUtility } from 'shared/utility/randomUtility';
import { OneStrokeWritingQuestionJsonDao } from '../../dataAccess/oneStrokeWritingQuestionJsonDao';
import { OneStrokeWritingQuestionDto } from '../queries/oneStrokeWritingQuestionDto';

export class GetOneStrokeWritingQuestionQueryProcessor {
    private readonly _dao: OneStrokeWritingQuestionJsonDao;

    public constructor() {
        this._dao = new OneStrokeWritingQuestionJsonDao();
    }

    public async execute(width: number, height: number, straight: boolean): Promise<OneStrokeWritingQuestionDto> {
        const count = await this._dao.getQuestionCount(width, height, straight);
        const index = RandomUtility.random(0, count);

        const cells = await this._dao.select(width, height, index, straight);
        if (!cells) {
            throw new Error('one stroke writing question not found.');
        }

        const transformedCells = RandomUtility.transformation(cells);

        return transformedCells;
    }
}
