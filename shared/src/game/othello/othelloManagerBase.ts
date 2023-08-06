import { OthelloBoardCell } from './enums/othelloBoardCell';
import { Turn } from './enums/turn';
import { Vector } from './vector';
import { OthelloBoard } from './othelloBoard';
import { Result } from './enums/result';

export abstract class OthelloManagerBase {
    protected _currentTurn: Turn = Turn.Black;

    protected _result: Result = Result.Undecided;

    public readonly board: OthelloBoard;

    get currentStone(): OthelloBoardCell {
        return this.currentTurn === Turn.Black ? OthelloBoardCell.Black : OthelloBoardCell.White;
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

    public constructor(size: number) {
        this.board = new OthelloBoard(size);
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
            this.rotateTurn();
            this.updateResult();

            return true;
        }

        return false;
    }

    protected rotateTurn(): void {
        const canPutBlack = this.canPutAll(OthelloBoardCell.Black);
        const canPutWhite = this.canPutAll(OthelloBoardCell.White);

        if (this._currentTurn === Turn.Black && canPutWhite) {
            this._currentTurn = Turn.White;
        } else if (this._currentTurn === Turn.White && canPutBlack) {
            this._currentTurn = Turn.Black;
        }
    }

    protected updateResult(): void {
        const blackCount = this.board.getCount(OthelloBoardCell.Black);
        const whiteCount = this.board.getCount(OthelloBoardCell.White);
        const canPutBlack = this.canPutAll(OthelloBoardCell.Black);
        const canPutWhite = this.canPutAll(OthelloBoardCell.White);

        if (!canPutBlack && !canPutWhite) {
            if (blackCount > whiteCount) {
                this._result = Result.Black;
            } else if (whiteCount > blackCount) {
                this._result = Result.White;
            } else {
                this._result = Result.Draw;
            }
        } else {
            this._result = Result.Undecided;
        }
    }

    protected canPut(x: number, y: number, chip: OthelloBoardCell): boolean {
        const currentChip = this.board.get(x, y);
        if (currentChip !== OthelloBoardCell.Empty && currentChip !== OthelloBoardCell.HighLight) {
            return false;
        }

        for (const v of Vector.all) {
            if (this.reverse(x, y, v.x, v.y, chip, true) > 0) {
                return true;
            }
        }

        return false;
    }

    protected canPutAll(chip: OthelloBoardCell): boolean {
        for (let x = 0; x < this.board.size; x++) {
            for (let y = 0; y < this.board.size; y++) {
                if (this.canPut(x, y, chip)) {
                    return true;
                }
            }
        }

        return false;
    }

    protected put(x: number, y: number, chip: OthelloBoardCell): boolean {
        if (!this.canPut(x, y, chip)) {
            return false;
        }

        let count = 0;
        for (const v of Vector.all) {
            count += this.reverse(x, y, v.x, v.y, chip);
        }
        if (count > 0) {
            this.board.set(x, y, chip);
        }

        return count > 0;
    }

    protected reverse(x1: number, y1: number, dx: number, dy: number, chip1: OthelloBoardCell, isSearchOnly = false): number {
        x1 += dx;
        y1 += dy;

        let x2 = x1;
        let y2 = y1;
        let count = 0;
        const chip2 = this.board.get(x2, y2);

        if (this.canSearch(chip1, chip2)) {
            do {
                x2 += dx;
                y2 += dy;
            } while (this.board.get(x2, y2) === chip2);

            if (this.board.get(x2, y2) === chip1) {
                do {
                    x2 -= dx;
                    y2 -= dy;
                    count++;

                    if (!isSearchOnly) {
                        this.board.set(x2, y2, chip1);
                    }
                } while (!(x1 === x2 && y1 === y2));
            }
        }

        return count;
    }

    protected canSearch(chip1: OthelloBoardCell, chip2: OthelloBoardCell): boolean {
        return (
            (chip1 == OthelloBoardCell.Black && chip2 == OthelloBoardCell.White) ||
            (chip2 == OthelloBoardCell.Black && chip1 == OthelloBoardCell.White)
        );
    }
}
