import { OthelloBoardCell } from 'shared/game/othello/enums/othelloBoardCell';
import { Turn } from 'shared/game/othello/enums/turn';

export class OthelloNextCommand {
    public readonly size: number;

    public readonly cells: OthelloBoardCell[][];

    public readonly currentTurn: Turn;

    public readonly repeatCount: number;

    public constructor(cells: OthelloBoardCell[][], currentTurn: Turn, repeatCount: number) {
        this.size = cells.length;
        this.cells = cells;
        this.currentTurn = currentTurn;
        this.repeatCount = repeatCount;
    }
}
