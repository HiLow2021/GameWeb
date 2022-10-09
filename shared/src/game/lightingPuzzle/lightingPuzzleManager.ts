import { CommonUtility } from '../../utility/commonUtility';
import { RandomUtility } from '../../utility/randomUtility';
import { LightingPuzzleBoardCell } from './enum/lightingPuzzleBoardCell';
import { Result } from './enum/result';
import { LightingPuzzleBoard } from './lightingPuzzleBoard';
import { Vector } from './vector';

export class LightingPuzzleManager {
    private _startPosition: Vector | undefined;

    private _currentPosition: Vector | undefined;

    private _result: Result = Result.undecided;

    public readonly board: LightingPuzzleBoard;

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
        this.board = new LightingPuzzleBoard(width, height);
        this.straightMode = straightMode;

        this.initialize();
    }

    public initialize(): void {
        this._startPosition = undefined;
        this._currentPosition = undefined;
        this._result = Result.undecided;
        this.board.initialize();
        this.setRandomBlock();
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
        const succeeded = this.board.cells.flat().every((x) => x !== LightingPuzzleBoardCell.off);
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

            return this.board.get(x, y) !== LightingPuzzleBoardCell.off;
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
            this.board.set(x1, y1, LightingPuzzleBoardCell.on);

            return true;
        }

        let x2 = this._currentPosition.x;
        let y2 = this._currentPosition.y;
        const dx = CommonUtility.clamp(x1 - x2, -1, 1);
        const dy = CommonUtility.clamp(y1 - y2, -1, 1);

        do {
            x2 += dx;
            y2 += dy;
            this.board.set(x2, y2, LightingPuzzleBoardCell.on);
        } while (this.straightMode ? this.board.get(x2 + dx, y2 + dy) === LightingPuzzleBoardCell.off : !(x1 === x2 && y1 === y2));

        this._currentPosition = new Vector(x2, y2);

        return true;
    }

    private canMove(x1: number, y1: number): boolean {
        if (this.board.get(x1, y1) !== LightingPuzzleBoardCell.off) {
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
            } while (!(x1 === x2 && y1 === y2) && this.board.get(x2, y2) === LightingPuzzleBoardCell.off);

            return x1 === x2 && y1 === y2;
        }

        return true;
    }

    private setRandomBlock(count = 2): void {
        while (count-- > 0) {
            const x = RandomUtility.random(0, this.board.width);
            const y = RandomUtility.random(0, this.board.height);

            this.board.set(x, y, LightingPuzzleBoardCell.block);
        }
    }
}
