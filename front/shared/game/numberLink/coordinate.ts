import { Vector } from 'shared/game/numberLink/vector';

export type Coordinate = {
    x: number;
    y: number;
    number?: number;
    routes: Vector[];
    color: string;
};
