import { GomokuBoardCell } from 'shared/game/gomoku/enums/gomokuBoardCell';
import { Turn } from 'shared/game/gomoku/enums/turn';

export class GomokuNextCommand {
    public readonly width: number;

    public readonly height: number;

    public readonly cells: GomokuBoardCell[][];

    public readonly currentTurn: Turn;

    public constructor(cells: GomokuBoardCell[][], currentTurn: Turn) {
        this.width = cells[0].length;
        this.height = cells.length;
        this.cells = cells;
        this.currentTurn = currentTurn;
    }
}
