import { RandomUtility } from 'shared/utility/randomUtility';
import { IllustrationLogicQuestionJsonDao } from '../../dataAccess/IllustrationLogicQuestionJsonDao';
import { IllustrationLogicQuestionDto } from '../queries/illustrationLogicQuestionDto';

export class GetIllustrationLogicQuestionQueryProcessor {
    private readonly _dao: IllustrationLogicQuestionJsonDao;

    public constructor() {
        this._dao = new IllustrationLogicQuestionJsonDao();
    }

    public async execute(width: number, height: number): Promise<IllustrationLogicQuestionDto> {
        const count = await this._dao.getQuestionCount(width, height);
        const index = RandomUtility.random(0, count);

        const cells = await this._dao.select(width, height, index);
        if (!cells) {
            throw new Error('illustration logic question not found.');
        }

        return cells;
    }
}
