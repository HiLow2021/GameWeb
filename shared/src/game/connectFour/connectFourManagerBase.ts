import { ConnectFourBoard } from './connectFourBoard';
import { ConnectFourBoardCell } from './enums/connectFourBoardCell';
import { Result } from './enums/result';
import { Turn } from './enums/turn';
import { Vector } from './vector';

export abstract class ConnectFourManagerBase {
    protected _currentTurn: Turn = Turn.black;

    protected _result: Result = Result.undecided;

    public readonly board: ConnectFourBoard;

    public readonly winCount: number;

    get currentStone(): ConnectFourBoardCell {
        return this.currentTurn === Turn.black ? ConnectFourBoardCell.black : ConnectFourBoardCell.white;
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

    public constructor(width: number, height: number, winCount = 4) {
        this.board = new ConnectFourBoard(width, height);
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

    protected updateResult(x: number, y: number, chip: ConnectFourBoardCell): void {
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

    protected checkWin(x: number, y: number, chip: ConnectFourBoardCell): boolean {
        return this.countAll(x, y, chip).some((count) => count >= this.winCount);
    }

    protected canPut(x: number, y: number): boolean {
        const chip1 = this.board.get(x, y);
        const chip2 = this.board.get(x, y + 1);

        return (
            (chip1 === ConnectFourBoardCell.empty || chip1 === ConnectFourBoardCell.highLight) &&
            chip2 !== ConnectFourBoardCell.empty &&
            chip2 !== ConnectFourBoardCell.highLight
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
        const side1 = Number(sideChip1 === ConnectFourBoardCell.empty || sideChip1 === ConnectFourBoardCell.highLight);

        let count = 0;
        while (this.board.get(x, y) === chip) {
            x -= dx;
            y -= dy;
            count++;
        }
        const sideChip2 = this.board.get(x, y);
        const side2 = Number(sideChip2 === ConnectFourBoardCell.empty || sideChip2 === ConnectFourBoardCell.highLight);

        if (includingEmptySides) {
            count += side1 + side2;
        }

        return count;
    }

    protected countAll(x: number, y: number, chip: ConnectFourBoardCell, includingEmptySides = false): number[] {
        return Vector.half.map((direction) => this.count(x, y, direction.x, direction.y, chip, includingEmptySides));
    }
}
