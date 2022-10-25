import { OthelloBoardCell } from 'shared/game/othello/enums/othelloBoardCell';
import { Turn } from 'shared/game/othello/enums/turn';

export type PostOthelloNextRequest = {
    cells: OthelloBoardCell[][];

    currentTurn: Turn;

    repeatCount: number;
};
