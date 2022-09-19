import { GomokuBoardCell } from './enums/gomokuBoardCell';
import { Result } from './enums/result';
import { Turn } from './enums/turn';
import { GomokuBoard } from './gomokuBoard';
import { Vector } from './vector';

export abstract class GomokuManagerBase {
    protected _currentTurn: Turn = Turn.black;

    protected _result: Result = Result.undecided;

    public readonly board: GomokuBoard;

    public readonly winCount: number;

    get currentStone(): GomokuBoardCell {
        return this.currentTurn === Turn.black ? GomokuBoardCell.black : GomokuBoardCell.white;
    }

    get currentTurn(): Turn {
        return this._currentTurn;
    }

    get isFinished(): boolean {
        return this._result !== Result.undecided;
    }

    get result(): Result {
        return this._result;
    }

    public constructor(width: number, height: number, winCount = 5) {
        this.board = new GomokuBoard(width, height);
        this.winCount = winCount;
        this.initialize();
    }

    public initialize(): void {
        this._currentTurn = Turn.black;
        this._result = Result.undecided;
        this.board.initialize();
    }

    public next(x: number, y: number): boolean {
        if (this.isFinished) {
            return false;
        }

        if (this.put(x, y, this.currentStone)) {
            this.updateResult(x, y, this.currentStone);
            this.rotateTurn();

            return true;
        }

        return false;
    }

    protected rotateTurn(): void {
        if (this._currentTurn === Turn.black) {
            this._currentTurn = Turn.white;
        } else {
            this._currentTurn = Turn.black;
        }
    }

    protected updateResult(x: number, y: number, chip: GomokuBoardCell): void {
        const win = this.checkWin(x, y, chip);

        if (win && this._currentTurn === Turn.black) {
            this._result = Result.black;
        } else if (win && this._currentTurn === Turn.white) {
            this._result = Result.white;
        } else if (!this.canPutAll()) {
            this._result = Result.draw;
        } else {
            this._result = Result.undecided;
        }
    }

    protected checkWin(x: number, y: number, chip: GomokuBoardCell): boolean {
        return this.countAll(x, y, chip).some((count) => count >= this.winCount);
    }

    protected canPut(x: number, y: number): boolean {
        return this.board.get(x, y) === GomokuBoardCell.empty;
    }

    protected canPutAll(): boolean {
        for (let x = 0; x < this.board.width; x++) {
            for (let y = 0; y < this.board.height; y++) {
                if (this.canPut(x, y)) {
                    return true;
                }
            }
        }

        return false;
    }

    protected put(x: number, y: number, chip: GomokuBoardCell): boolean {
        if (!this.canPut(x, y)) {
            return false;
        }

        this.board.set(x, y, chip);

        return true;
    }

    protected count(x: number, y: number, dx: number, dy: number, chip: GomokuBoardCell, includingEmptySides = false): number {
        while (this.board.get(x + dx, y + dy) === chip) {
            x += dx;
            y += dy;
        }
        const side1 = Number(this.board.get(x + dx, y + dy) === GomokuBoardCell.empty);

        let count = 0;
        while (this.board.get(x, y) === chip) {
            x -= dx;
            y -= dy;
            count++;
        }
        const side2 = Number(this.board.get(x, y) === GomokuBoardCell.empty);

        if (includingEmptySides) {
            count += side1 + side2;
        }

        return count;
    }

    protected countAll(x: number, y: number, chip: GomokuBoardCell, includingEmptySides = false): number[] {
        return Vector.half.map((direction) => this.count(x, y, direction.x, direction.y, chip, includingEmptySides));
    }
}
