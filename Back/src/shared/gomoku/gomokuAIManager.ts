import { GomokuBoardCell } from './enums/gomokuBoardCell';
import { Turn } from './enums/turn';
import { GomokuManagerBase } from './gomokuManagerBase';
import { Vector } from './vector';

export class GomokuAIManager extends GomokuManagerBase {
    get opponentStone(): GomokuBoardCell {
        return this.currentStone === GomokuBoardCell.black ? GomokuBoardCell.white : GomokuBoardCell.black;
    }

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

    public simpleMethod(): Vector {
        for (let i = this.winCount; i > 2; i--) {
            for (let j = 0; j < 2; j++) {
                const candidates = this.searchCandidates(i, this.currentStone);
                if (candidates.length > 0) {
                    return candidates[0];
                }

                this.rotateTurn();
            }
        }

        return this.randomMethod();
    }

    private searchCandidates(lineCount: number, chip: GomokuBoardCell): Vector[] {
        const candidates: Vector[] = [];
        for (let x = 0; x < this.board.width; x++) {
            for (let y = 0; y < this.board.height; y++) {
                if (this.board.get(x, y) === 'empty') {
                    this.board.set(x, y, chip);
                    if (this.countAll(x, y, chip).some((count) => count === lineCount)) {
                        candidates.push(new Vector(x, y));
                    }
                    this.board.set(x, y, GomokuBoardCell.empty);
                }
            }
        }

        return candidates;
    }

    private random(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min) + min);
    }
}
