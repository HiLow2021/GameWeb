import { NumberLinkBoardCell } from 'shared/game/numberLink/type/numberLinkBoardCell';
import { Response } from './response';

export type GetNumberLinkQuestionResponse = Response & {
    cells: NumberLinkBoardCell[][];
};
