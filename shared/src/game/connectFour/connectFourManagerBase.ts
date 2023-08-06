import { ConnectFourBoard } from './connectFourBoard';
import { ConnectFourBoardCell } from './enums/connectFourBoardCell';
import { Result } from './enums/result';
import { Turn } from './enums/turn';
import { Vector } from './vector';

export abstract class ConnectFourManagerBase {
    protected _currentTurn: Turn = Turn.Black;

    protected _result: Result = Result.Undecided;

    public readonly board: ConnectFourBoard;

    public readonly winCount: number;

    get currentStone(): ConnectFourBoardCell {
        return this.currentTurn === Turn.Black ? ConnectFourBoardCell.Black : ConnectFourBoardCell.White;
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

    public constructor(width: number, height: number, winCount = 4) {
        this.board = new ConnectFourBoard(width, height);
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

    protected updateResult(x: number, y: number, chip: ConnectFourBoardCell): void {
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

    protected checkWin(x: number, y: number, chip: ConnectFourBoardCell): boolean {
        return this.countAll(x, y, chip).some((count) => count >= this.winCount);
    }

    protected canPut(x: number, y: number): boolean {
        const chip1 = this.board.get(x, y);
        const chip2 = this.board.get(x, y + 1);

        return (
            (chip1 === ConnectFourBoardCell.Empty || chip1 === ConnectFourBoardCell.HighLight) &&
            chip2 !== ConnectFourBoardCell.Empty &&
            chip2 !== ConnectFourBoardCell.HighLight
        );
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

    protected put(x: number, y: number, chip: ConnectFourBoardCell): boolean {
        if (!this.canPut(x, y)) {
            return false;
        }

        this.board.set(x, y, chip);

        return true;
    }

    protected count(x: number, y: number, dx: number, dy: number, chip: ConnectFourBoardCell, includingEmptySides = false): number {
        while (this.board.get(x + dx, y + dy) === chip) {
            x += dx;
            y += dy;
        }
        const sideChip1 = this.board.get(x + dx, y + dy);
        const side1 = Number(sideChip1 === ConnectFourBoardCell.Empty || sideChip1 === ConnectFourBoardCell.HighLight);

        let count = 0;
        while (this.board.get(x, y) === chip) {
            x -= dx;
            y -= dy;
            count++;
        }
        const sideChip2 = this.board.get(x, y);
        const side2 = Number(sideChip2 === ConnectFourBoardCell.Empty || sideChip2 === ConnectFourBoardCell.HighLight);

        if (includingEmptySides) {
            count += side1 + side2;
        }

        return count;
    }

    protected countAll(x: number, y: number, chip: ConnectFourBoardCell, includingEmptySides = false): number[] {
        return Vector.half.map((direction) => this.count(x, y, direction.x, direction.y, chip, includingEmptySides));
    }
}
