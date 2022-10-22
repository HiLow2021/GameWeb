import { RandomUtility } from '../../utility/randomUtility';
import { SlidingPuzzleBoard } from './slidingPuzzleBoard';
import { Vector } from './vector';

export class SlidingPuzzleManager {
    private _step = 0;

    public readonly board: SlidingPuzzleBoard;

    public readonly missingNumber: number;

    get step(): number {
        return this._step;
    }

    get isSorted(): boolean {
        return this.board.cells.flat().every((x, i) => x === i);
    }

    public constructor(width: number, height: number, missingNumber?: number) {
        this.board = new SlidingPuzzleBoard(width, height);
        this.missingNumber = missingNumber ?? this.board.square - 1;

        this.initialize();
        this.validate();
    }

    public initialize(): void {
        this.board.initialize();
        this.shuffle(this.board.square * this.board.square);
        this._step = 0;
    }

    public slide(x: number, y: number): boolean {
        for (const direction of Vector.all) {
            if (this.board.get(x + direction.x, y + direction.y) === this.missingNumber) {
                const result = this.board.swap(x, y, x + direction.x, y + direction.y);
                if (result) {
                    this._step++;
                }

                return result;
            }
        }

        return false;
    }

    private shuffle(step = 1000): void {
        const missingNumberPosition = this.board.find(this.missingNumber);
        if (!missingNumberPosition) {
            return;
        }

        for (let index = 0; index < step; index++) {
            for (const direction of RandomUtility.shuffle(Vector.all)) {
                if (this.slide(missingNumberPosition.x + direction.x, missingNumberPosition.y + direction.y)) {
                    missingNumberPosition.x += direction.x;
                    missingNumberPosition.y += direction.y;

                    break;
                }
            }
        }
    }

    private validate(): void {
        if (this.missingNumber >= this.board.square && this.board.square < 0) {
            throw new Error(`missingNumberは0以上${(this.board.square - 1).toString()}以下にしてください。`);
        }
    }
}
