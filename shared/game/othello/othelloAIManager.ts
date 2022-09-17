import { CommonUtility } from '../../utility/commonUtility';
import { RandomUtility } from '../../utility/randomUtility';
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
        let x: number, y: number;

        do {
            x = RandomUtility.random(0, this.board.size);
            y = RandomUtility.random(0, this.board.size);
        } while (!this.canPut(x, y, this.currentStone));

        return new Vector(x, y);
    }

    public monteCarloMethod(repeatCount: number): Vector {
        const winCells = CommonUtility.create2Array<number>(this.board.size, this.board.size);
        const backCells = CommonUtility.create2Array<OthelloBoardCell>(this.board.size, this.board.size);
        const backTurn = this._currentTurn;
        const result = this.randomMethod();

        CommonUtility.copy2Array(this.board.cells, backCells);

        for (let index = 0; index < repeatCount; index++) {
            const first = this.randomMethod();
            this.next(first.x, first.y);

            while (!this.isFinished) {
                const step = this.randomMethod();
                this.next(step.x, step.y);
            }

            const blackCount = this.board.getCount(OthelloBoardCell.black);
            const whiteCount = this.board.getCount(OthelloBoardCell.white);

            if ((backTurn === Turn.black && blackCount > whiteCount) || (backTurn === Turn.white && whiteCount > blackCount)) {
                winCells[first.y][first.x]++;
            }

            CommonUtility.copy2Array(backCells, this.board.cells);
            this._currentTurn = backTurn;
        }

        let max = 0;
        for (let y = 0; y < winCells.length; y++) {
            for (let x = 0; x < winCells[y].length; x++) {
                if (winCells[y][x] > max) {
                    result.x = x;
                    result.y = y;
                    max = winCells[y][x];
                }
            }
        }

        return result;
    }
}
