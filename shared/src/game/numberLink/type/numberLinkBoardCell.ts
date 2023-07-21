import { Vector } from '../vector';

export type NumberLinkBoardCell = {
    id: number;
    x: number;
    y: number;
    number?: number;
    routes: Vector[];
};
