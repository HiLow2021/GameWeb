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

    public constructor(width: number, height: number, winCount: number = 5) {
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

    protected rotateTurn(): void {
        if (this._currentTurn === Turn.black) {
            this._currentTurn = Turn.white;
        } else {
            this._currentTurn = Turn.black;
        }
    }

    protected updateResult(x: number, y: number, chip: GomokuBoardCell): void {
        const win = this.checkWin(x, y, chip);

        if (win && Turn.black) {
            this._result = Result.black;
        } else if (win && Turn.white) {
            this._result = Result.white;
        } else if (!this.canPutAll()) {
            this._result = Result.draw;
        } else {
            this._result = Result.undecided;
        }
    }

    protected checkWin(x: number, y: number, chip: GomokuBoardCell): boolean {
        for (const v of Vector.half) {
            if (this.checkLine(x, y, v.x, v.y, chip)) {
                return true;
            }
        }

        return false;
    }

    protected checkLine(x: number, y: number, dx: number, dy: number, chip: GomokuBoardCell): boolean {
        do {
            x += dx;
            y += dy;
        } while (this.board.get(x, y) === chip);

        let count = 0;
        let result = false;
        do {
            x -= dx;
            y -= dy;
            result = count++ >= this.winCount;
        } while (this.board.get(x, y) === chip && !result);

        return result;
    }
}
