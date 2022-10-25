import { OneStrokeWritingBoardCell } from 'shared/game/oneStrokeWriting/enum/oneStrokeWritingBoardCell';
import { ArrayUtility } from 'shared/utility/arrayUtility';
import { RandomUtility } from 'shared/utility/randomUtility';
import { OneStrokeWritingQuestionDao } from '../../dataAccess/oneStrokeWritingQuestionDao';
import { OneStrokeWritingQuestionDto } from '../queries/oneStrokeWritingQuestionDto';

export class GetOneStrokeWritingQuestionQueryProcessor {
    private readonly _dao: OneStrokeWritingQuestionDao;

    public constructor() {
        this._dao = new OneStrokeWritingQuestionDao();
    }

    public async execute(width: number, height: number, straight: boolean): Promise<OneStrokeWritingQuestionDto> {
        const count = await this._dao.getQuestionCount(width, height, straight);
        const index = RandomUtility.random(0, count);

        const cells = await this._dao.select(width, height, index, straight);
        if (!cells) {
            throw new Error('one stroke writing question not found.');
        }

        const transformedCells = this.randomTransformation(cells);

        return transformedCells;
    }

    private randomRotate(source: OneStrokeWritingBoardCell[][]): OneStrokeWritingBoardCell[][] {
        const result = ArrayUtility.create2Array<OneStrokeWritingBoardCell>(source[0].length, source.length);
        ArrayUtility.copy2Array(source, result);

        const rotate = RandomUtility.random(0, 4);
        switch (rotate) {
            case 0:
                return ArrayUtility.rotate90(result);

            case 1:
                return ArrayUtility.rotate180(result);

            case 2:
                return ArrayUtility.rotate270(result);

            default:
                return result;
        }
    }

    private randomTranspose(source: OneStrokeWritingBoardCell[][]): OneStrokeWritingBoardCell[][] {
        const result = ArrayUtility.create2Array<OneStrokeWritingBoardCell>(source[0].length, source.length);
        ArrayUtility.copy2Array(source, result);

        const transpose = RandomUtility.random(0, 2);
        switch (transpose) {
            case 0:
                return ArrayUtility.transpose(result);

            default:
                return result;
        }
    }

    private randomTransformation(source: OneStrokeWritingBoardCell[][]): OneStrokeWritingBoardCell[][] {
        return this.randomTranspose(this.randomRotate(source));
    }
}
