import { Vector } from '../vector';

export type NumberLinkBoardCell = {
    x: number;
    y: number;
    number?: number;
    routes: Vector[];
};
