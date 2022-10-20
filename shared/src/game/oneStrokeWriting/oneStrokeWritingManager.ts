import { CommonUtility } from '../../utility/commonUtility';
import { OneStrokeWritingBoardCell } from './enum/oneStrokeWritingBoardCell';
import { Result } from './enum/result';
import { OneStrokeWritingBoard } from './oneStrokeWritingBoard';
import { Vector } from './vector';

export class OneStrokeWritingManager {
    private readonly _apiUrl = 'http://localhost:5000/api/oneStrokeWriting/question';

    private _question: OneStrokeWritingBoardCell[][];

    private _startPosition: Vector | undefined;

    private _currentPosition: Vector | undefined;

    private _result: Result = Result.undecided;

    public readonly board: OneStrokeWritingBoard;

    public readonly straightMode: boolean;

    get startPosition(): Vector | undefined {
        return this._startPosition;
    }

    get currentPosition(): Vector | undefined {
        return this._currentPosition;
    }

    get result(): Result {
        return this._result;
    }

    public constructor(width: number, height: number, straightMode = true) {
        this.board = new OneStrokeWritingBoard(width, height);
        this.straightMode = straightMode;
        this._question = CommonUtility.create2Array(width, height);
        CommonUtility.copy2Array(this.board.cells, this._question);
    }

    public async initialize(): Promise<void> {
        const params = new URLSearchParams({
            width: String(this.board.width),
            height: String(this.board.height),
            straight: String(this.straightMode)
        });
        const response = await fetch(`${this._apiUrl}?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();

        CommonUtility.copy2Array(json.cells, this._question);
        this.reset();
    }

    public reset(): void {
        this._startPosition = undefined;
        this._currentPosition = undefined;
        this._result = Result.undecided;
        CommonUtility.copy2Array(this._question, this.board.cells);
    }

    public next(x: number, y: number): boolean {
        if (this.result !== Result.undecided) {
            return false;
        }

        if (this.move(x, y)) {
            this.updateResult();

            return true;
        }

        return false;
    }

    private updateResult(): void {
        const succeeded = this.board.cells.flat().every((x) => x !== OneStrokeWritingBoardCell.off);
        if (succeeded) {
            this._result = Result.succeeded;

            return;
        }

        const failed = Vector.all.every((direction) => {
            if (!this._currentPosition) {
                return false;
            }

            const x = this._currentPosition.x + direction.x;
            const y = this._currentPosition.y + direction.y;

            return this.board.get(x, y) !== OneStrokeWritingBoardCell.off;
        });
        if (failed) {
            this._result = Result.failed;

            return;
        }

        this._result = Result.undecided;
    }

    private move(x1: number, y1: number): boolean {
        if (!this.canMove(x1, y1)) {
            return false;
        }

        if (!this._currentPosition) {
            this._startPosition = new Vector(x1, y1);
            this._currentPosition = this._startPosition;
            this.board.set(x1, y1, OneStrokeWritingBoardCell.on);

            return true;
        }

        let x2 = this._currentPosition.x;
        let y2 = this._currentPosition.y;
        const dx = CommonUtility.clamp(x1 - x2, -1, 1);
        const dy = CommonUtility.clamp(y1 - y2, -1, 1);

        do {
            x2 += dx;
            y2 += dy;
            this.board.set(x2, y2, OneStrokeWritingBoardCell.on);
        } while (this.straightMode ? this.board.get(x2 + dx, y2 + dy) === OneStrokeWritingBoardCell.off : !(x1 === x2 && y1 === y2));

        this._currentPosition = new Vector(x2, y2);

        return true;
    }

    private canMove(x1: number, y1: number): boolean {
        if (this.board.get(x1, y1) !== OneStrokeWritingBoardCell.off) {
            return false;
        }

        if (this._currentPosition) {
            let x2 = this._currentPosition.x;
            let y2 = this._currentPosition.y;
            const dx = CommonUtility.clamp(x1 - x2, -1, 1);
            const dy = CommonUtility.clamp(y1 - y2, -1, 1);

            if ((dx === 0 && dy === 0) || (dx !== 0 && dy !== 0)) {
                return false;
            }

            do {
                x2 += dx;
                y2 += dy;
            } while (!(x1 === x2 && y1 === y2) && this.board.get(x2, y2) === OneStrokeWritingBoardCell.off);

            return x1 === x2 && y1 === y2;
        }

        return true;
    }
}
