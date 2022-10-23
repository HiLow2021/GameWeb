import { ConnectFourBoardCell } from 'shared/game/connectFour/enums/connectFourBoardCell';
import { Turn } from 'shared/game/connectFour/enums/turn';

export type PostConnectFourNextRequest = {
    cells: ConnectFourBoardCell[][];

    currentTurn: Turn;
};
