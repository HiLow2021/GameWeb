import { OneStrokeWritingBoardCell } from 'shared/game/oneStrokeWriting/enum/oneStrokeWritingBoardCell';
import { Response } from './response';

export type GetOneStrokeWritingQuestionResponse = Response & {
    cells: OneStrokeWritingBoardCell[][];
};
