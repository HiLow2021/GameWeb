import { ConnectFourBoardCell } from 'shared/game/connectFour/enums/connectFourBoardCell';
import { Turn } from 'shared/game/connectFour/enums/turn';

export class ConnectFourNextCommand {
    public readonly width: number;

    public readonly height: number;

    public readonly cells: ConnectFourBoardCell[][];

    public readonly currentTurn: Turn;

    public constructor(cells: ConnectFourBoardCell[][], currentTurn: Turn) {
        this.width = cells[0].length;
        this.height = cells.length;
        this.cells = cells;
        this.currentTurn = currentTurn;
    }
}
