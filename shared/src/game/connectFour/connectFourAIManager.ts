import { RandomUtility } from '../../utility/randomUtility';
import { ConnectFourManagerBase } from './connectFourManagerBase';
import { ConnectFourBoardCell } from './enums/connectFourBoardCell';
import { Turn } from './enums/turn';
import { Vector } from './vector';

export class ConnectFourAIManager extends ConnectFourManagerBase {
    get opponentStone(): ConnectFourBoardCell {
        return this.currentStone === ConnectFourBoardCell.Black ? ConnectFourBoardCell.White : ConnectFourBoardCell.Black;
    }

    public setBoard(cells: ConnectFourBoardCell[][], currentTurn: Turn): void {
        this.board.setAll(cells);
        this._currentTurn = currentTurn;
    }

    public randomMethod(min = new Vector(0, 0), max = new Vector(this.board.width, this.board.height)): Vector {
        let x: number, y: number;

        do {
            x = RandomUtility.random(min.x, max.x);
            y = RandomUtility.random(min.y, max.y);
        } while (!this.canPut(x, y));

        return new Vector(x, y);
    }

    public improvedRandomMethod(): Vector {
        const candidates = this.getCanPutPositions().filter((position) => !this.isDangerPosition(position.x, position.y));
        if (candidates.length > 0) {
            return candidates[RandomUtility.random(0, candidates.length)];
        }

        return this.randomMethod();
    }

    public basicMethod(): Vector {
        for (const chip of [this.currentStone, this.opponentStone]) {
            const candidates = this.searchCandidates(chip, this.winCount);
            if (candidates.length > 0) {
                return candidates[RandomUtility.random(0, candidates.length)];
            }
        }
        for (let i = this.winCount - 1; i > 1; i--) {
            for (const chip of [this.opponentStone, this.currentStone]) {
                const candidates = this.searchCandidates(chip, i);
                if (candidates.length > 0) {
                    return candidates[RandomUtility.random(0, candidates.length)];
                }
            }
        }

        return this.improvedRandomMethod();
    }

    private searchCandidates(chip: ConnectFourBoardCell, neededLineCount: number): Vector[] {
        const candidates = this.getCanPutPositions().filter((position) => {
            return this.isCandidate(position.x, position.y, chip, neededLineCount, neededLineCount < this.winCount);
        });

        return candidates;
    }

    private isCandidate(x: number, y: number, chip: ConnectFourBoardCell, neededLineCount: number, neededEmptySides: boolean): boolean {
        this.board.set(x, y, chip);
        let result = neededEmptySides
            ? this.countAll(x, y, chip, true).some((count) => count >= neededLineCount + 2)
            : this.countAll(x, y, chip).some((count) => count >= neededLineCount);
        this.board.set(x, y, ConnectFourBoardCell.Empty);

        if (result && neededLineCount < this.winCount) {
            result = !this.isDangerPosition(x, y, neededLineCount + 1);
        }

        return result;
    }

    private isDangerPosition(x: number, y: number, neededLineCount = this.winCount): boolean {
        this.board.set(x, y, this.currentStone);

        if (!this.canPut(x, y - 1)) {
            this.board.set(x, y, ConnectFourBoardCell.Empty);

            return false;
        }

        this.board.set(x, y - 1, this.opponentStone);
        const result = this.countAll(x, y - 1, this.opponentStone).some((count) => count >= neededLineCount);
        this.board.set(x, y - 1, ConnectFourBoardCell.Empty);

        this.board.set(x, y, ConnectFourBoardCell.Empty);

        return result;
    }

    private getCanPutPositions(): Vector[] {
        const positions: Vector[] = [];
        for (let x = 0; x < this.board.width; x++) {
            for (let y = 0; y < this.board.height; y++) {
                if (this.canPut(x, y)) {
                    positions.push(new Vector(x, y));
                }
            }
        }

        return positions;
    }
}
