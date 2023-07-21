import { OneStrokeWritingBoardCell } from 'shared/game/oneStrokeWriting/enum/oneStrokeWritingBoardCell';

export type OneStrokeWritingQuestion = {
    width: number;
    height: number;
    block: number;
    straight: boolean;
    cells: OneStrokeWritingBoardCell[][];
};
