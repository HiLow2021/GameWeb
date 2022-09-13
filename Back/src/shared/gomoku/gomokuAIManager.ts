import { GomokuBoardCell } from './enums/gomokuBoardCell';
import { Turn } from './enums/turn';
import { GomokuManagerBase } from './gomokuManagerBase';
import { Vector } from './vector';

export class GomokuAIManager extends GomokuManagerBase {
    public setBoard(cells: GomokuBoardCell[][], currentTurn: Turn): void {
        this.board.setAll(cells);
        this._currentTurn = currentTurn;
    }

    public randomMethod(): Vector {
        let x, y;

        do {
            x = this.random(0, this.board.width);
            y = this.random(0, this.board.height);
        } while (!this.canPut(x, y));

        return new Vector(x, y);
    }


    private random(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min) + min);
    }
}
