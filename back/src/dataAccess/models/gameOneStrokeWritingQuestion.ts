import { OneStrokeWritingBoardCell } from 'shared/game/oneStrokeWriting/enum/oneStrokeWritingBoardCell';

export type GameOneStrokeWritingQuestion = {
    width: number;
    height: number;
    block: number;
    straight: boolean;
    cells: OneStrokeWritingBoardCell[][];
};
