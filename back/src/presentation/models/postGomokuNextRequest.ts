import { GomokuBoardCell } from 'shared/game/gomoku/enums/gomokuBoardCell';
import { Turn } from 'shared/game/gomoku/enums/turn';

export type PostGomokuNextRequest = {
    cells: GomokuBoardCell[][];

    currentTurn: Turn;
};
