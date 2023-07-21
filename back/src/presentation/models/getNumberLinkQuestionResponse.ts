import { NumberLinkBoardCell } from 'shared/game/numberLink/type/numberLinkBoardCell';
import { Result } from './result';

export type GetNumberLinkQuestionResponse = {
    cells: NumberLinkBoardCell[][];

    result: Result;
};
