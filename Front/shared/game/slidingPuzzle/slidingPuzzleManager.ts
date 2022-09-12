import { SlidingPuzzleBoard } from './slidingPuzzleBoard';
import { Vector } from './vector';

export class SlidingPuzzleManager {
    public readonly board: SlidingPuzzleBoard;

    public readonly missingNumber: number;

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
        this.shuffle();
    }

    public shuffle(step: number = 1000): void {
        const missingNumberPosition = this.board.find(this.missingNumber);
        if (!missingNumberPosition) {
            return;
        }

        for (let index = 0; index < step; index++) {
            for (const direction of this.shuffleArray(Vector.all)) {
                if (this.slide(missingNumberPosition.x + direction.x, missingNumberPosition.y + direction.y)) {
                    missingNumberPosition.x += direction.x;
                    missingNumberPosition.y += direction.y;

                    break;
                }
            }
        }
    }

    public slide(x: number, y: number): boolean {
        for (const direction of Vector.all) {
            if (this.board.get(x + direction.x, y + direction.y) === this.missingNumber) {
                return this.board.swap(x, y, x + direction.x, y + direction.y);
            }
        }

        return false;
    }

    private shuffleArray<T>(source: T[]): T[] {
        const result = [...source];
        for (let i = source.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [source[i], source[j]] = [source[j], source[i]];
        }

        return result;
    }

    private validate(): void {
        if (this.missingNumber >= this.board.square && this.board.square < 0) {
            throw new Error(`missingNumberは0以上${(this.board.square - 1).toString()}以下にしてください。`);
        }
    }
}
