import { RandomUtility } from '../../utility/randomUtility';
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
        let x: number, y: number;

        do {
            x = RandomUtility.random(0, this.board.width);
            y = RandomUtility.random(0, this.board.height);
        } while (!this.canPut(x, y));

        return new Vector(x, y);
    }

    public simpleMethod(): Vector {
        const backupTurn = this._currentTurn;
        for (let i = this.winCount; i > 2; i--) {
            for (let j = 0; j < 2; j++) {
                const candidates = this.searchCandidates(this.currentStone, i);
                if (candidates.length > 0) {
                    return candidates[RandomUtility.random(0, candidates.length)];
                }

                this.rotateTurn();
            }
        }

        this._currentTurn = backupTurn;
        for (let index = 0; index < 1000; index++) {
            for (let j = 0; j < 2; j++) {
                const position = this.randomMethod();
                if (this.searchTargetWithinRange(position.x, position.y, this.currentStone, 3)) {
                    return position;
                }

                this.rotateTurn();
            }
        }

        this._currentTurn = backupTurn;

        return this.randomMethod();
    }

    private searchCandidates(chip: GomokuBoardCell, neededLineCount: number): Vector[] {
        const candidates: Vector[] = [];
        for (let x = 0; x < this.board.width; x++) {
            for (let y = 0; y < this.board.height; y++) {
                if (this.isCandidate(x, y, chip, neededLineCount, neededLineCount < this.winCount)) {
                    candidates.push(new Vector(x, y));
                }
            }
        }

        return candidates;
    }

    private searchTargetWithinRange(x: number, y: number, chip: GomokuBoardCell, distance: number = 1): boolean {
        for (const direction of Vector.all) {
            for (let index = 0; index <= distance; index++) {
                if (this.board.get(x + direction.x * index, y + direction.y * index) === chip) {
                    return true;
                }
            }
        }

        return false;
    }

    private isCandidate(x: number, y: number, chip: GomokuBoardCell, neededLineCount: number, neededEmptySides: boolean): boolean {
        let result = false;
        if (this.board.get(x, y) === GomokuBoardCell.empty) {
            this.board.set(x, y, chip);
            result = neededEmptySides
                ? this.countAll(x, y, chip, true).some((count) => count >= neededLineCount + 2)
                : this.countAll(x, y, chip).some((count) => count >= neededLineCount);
            this.board.set(x, y, GomokuBoardCell.empty);
        }

        return result;
    }
}
