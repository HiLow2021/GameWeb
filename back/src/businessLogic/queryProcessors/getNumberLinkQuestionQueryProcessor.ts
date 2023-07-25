import { RandomUtility } from 'shared/utility/randomUtility';
import { NumberLinkQuestionJsonDao } from '../../dataAccess/numberLinkQuestionJsonDao';
import { NumberLinkQuestionDto } from '../queries/numberLinkQuestionDto';

export class GetNumberLinkQuestionQueryProcessor {
    private readonly _dao: NumberLinkQuestionJsonDao;

    public constructor() {
        this._dao = new NumberLinkQuestionJsonDao();
    }

    public async execute(width: number, height: number): Promise<NumberLinkQuestionDto> {
        const count = await this._dao.getQuestionCount(width, height);
        const index = RandomUtility.random(0, count);

        const cells = await this._dao.select(width, height, index);
        if (!cells) {
            throw new Error('number link question not found.');
        }

        const transformedCells = RandomUtility.transformation(cells).map((x, i) =>
            x.map((y, j) => ({
                id: i * x.length + j,
                x: j,
                y: i,
                number: y.number,
                routes: y.routes
            }))
        );

        return transformedCells;
    }
}
