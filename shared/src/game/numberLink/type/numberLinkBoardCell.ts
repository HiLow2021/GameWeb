import { NumberLinkBoardCellType } from '../enum/numberLinkBoardCellType';
import { Vector } from '../vector';

export type NumberLinkBoardCell = {
    type: NumberLinkBoardCellType;
    number?: number;
    routes: Vector[];
};
