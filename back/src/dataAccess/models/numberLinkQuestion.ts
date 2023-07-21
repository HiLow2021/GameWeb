import { NumberLinkBoardCell } from 'shared/game/numberLink/type/numberLinkBoardCell';

export type NumberLinkQuestion = {
    width: number;
    height: number;
    number: number;
    cells: (number | null)[][];
};
