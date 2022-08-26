import { OthelloBoardCell } from './enums/othelloBoardCell';
import { Turn } from './enums/turn';
import { OthelloManagerBase } from './othelloManagerBase';
import { Vector } from './vector';

export class OthelloAIManager extends OthelloManagerBase {
    public setBoard(cells: OthelloBoardCell[][], currentTurn: Turn): void {
        this.board.setAll(cells);
        this._currentTurn = currentTurn;
    }

    public randomMethod(): Vector {
        let x, y;

        do {
            x = this.random(0, this.board.size);
            y = this.random(0, this.board.size);
        } while (!this.canPut(x, y, this.currentStone));

        return new Vector(x, y);
    }

    private random(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min) + min);
    }
}
