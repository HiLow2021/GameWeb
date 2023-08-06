import { GomokuBoardCell } from './enums/gomokuBoardCell';
import { Result } from './enums/result';
import { Turn } from './enums/turn';
import { GomokuBoard } from './gomokuBoard';
import { Vector } from './vector';

export abstract class GomokuManagerBase {
    protected _currentTurn: Turn = Turn.Black;

    protected _result: Result = Result.Undecided;

    public readonly board: GomokuBoard;

    public readonly winCount: number;

    get currentStone(): GomokuBoardCell {
        return this.currentTurn === Turn.Black ? GomokuBoardCell.Black : GomokuBoardCell.White;
    }

    get currentTurn(): Turn {
        return this._currentTurn;
    }

    get isFinished(): boolean {
        return this._result !== Result.Undecided;
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
        this._currentTurn = Turn.Black;
        this._result = Result.Undecided;
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
        if (this._currentTurn === Turn.Black) {
            this._currentTurn = Turn.White;
        } else {
            this._currentTurn = Turn.Black;
        }
    }

    protected updateResult(x: number, y: number, chip: GomokuBoardCell): void {
        const win = this.checkWin(x, y, chip);

        if (win && this._currentTurn === Turn.Black) {
            this._result = Result.Black;
        } else if (win && this._currentTurn === Turn.White) {
            this._result = Result.White;
        } else if (!this.canPutAll()) {
            this._result = Result.Draw;
        } else {
            this._result = Result.Undecided;
        }
    }

    protected checkWin(x: number, y: number, chip: GomokuBoardCell): boolean {
        return this.countAll(x, y, chip).some((count) => count >= this.winCount);
    }

    protected canPut(x: number, y: number): boolean {
        return this.board.get(x, y) === GomokuBoardCell.Empty;
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
        const side1 = Number(this.board.get(x + dx, y + dy) === GomokuBoardCell.Empty);

        let count = 0;
        while (this.board.get(x, y) === chip) {
            x -= dx;
            y -= dy;
            count++;
        }
        const side2 = Number(this.board.get(x, y) === GomokuBoardCell.Empty);

        if (includingEmptySides) {
            count += side1 + side2;
        }

        return count;
    }

    protected countAll(x: number, y: number, chip: GomokuBoardCell, includingEmptySides = false): number[] {
        return Vector.half.map((direction) => this.count(x, y, direction.x, direction.y, chip, includingEmptySides));
    }
}
