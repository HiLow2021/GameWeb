import { OneStrokeWritingBoardCell } from 'shared/game/oneStrokeWriting/enum/oneStrokeWritingBoardCell';
import { Result } from './result';

export type GetOneStrokeWritingQuestionResponse = {
    cells: OneStrokeWritingBoardCell[][];

    result: Result;
};
