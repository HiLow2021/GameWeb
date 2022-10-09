import { RandomUtility } from '../../utility/randomUtility';
import { OneStrokeWritingBoardCell } from './enum/oneStrokeWritingBoardCell';
import { OneStrokeWritingBoard } from './oneStrokeWritingBoard';
import { Vector } from './vector';

export class OneStrokeWritingGenerator {
    public readonly board: OneStrokeWritingBoard;

    public readonly straightMode: boolean;

    public constructor(width: number, height: number, straightMode: boolean) {
        this.board = new OneStrokeWritingBoard(width, height);
        this.straightMode = straightMode;
    }

    public generate(minBlock: number, maxBlock: number, tryCount = 1000): boolean {
        for (let index = 0; index < tryCount; index++) {
            this.board.initialize();
            this.setRandomBlock(minBlock, maxBlock);

            if (this.checkAll()) {
                return true;
            }
        }

        this.board.initialize();

        return false;
    }

    private checkAll(): boolean {
        for (let x = 0; x < this.board.width; x++) {
            for (let y = 0; y < this.board.height; y++) {
                if (this.check(x, y)) {
                    return true;
                }
            }
        }

        return false;
    }

    private check(x: number, y: number): boolean {
        if (this.board.get(x, y) !== OneStrokeWritingBoardCell.off) {
            return false;
        }

        return this.move(x, y);
    }

    private move(x1: number, y1: number): boolean {
        this.board.set(x1, y1, OneStrokeWritingBoardCell.on);

        let result = this.board.cells.flat().every((x) => x !== OneStrokeWritingBoardCell.off);

        for (const direction of Vector.all) {
            let x2 = x1 + direction.x;
            let y2 = y1 + direction.y;
            if (this.board.get(x2, y2) === OneStrokeWritingBoardCell.off) {
                while (this.straightMode && this.board.get(x2 + direction.x, y2 + direction.y) === OneStrokeWritingBoardCell.off) {
                    this.board.set(x2, y2, OneStrokeWritingBoardCell.on);
                    x2 += direction.x;
                    y2 += direction.y;
                }

                result = this.move(x2, y2);

                while (this.straightMode && !(x2 === x1 + direction.x && y2 === y1 + direction.y)) {
                    x2 -= direction.x;
                    y2 -= direction.y;
                    this.board.set(x2, y2, OneStrokeWritingBoardCell.off);
                }

                if (result) {
                    break;
                }
            }
        }

        this.board.set(x1, y1, OneStrokeWritingBoardCell.off);

        return result;
    }

    private setRandomBlock(minBlock: number, maxBlock: number): void {
        let count = RandomUtility.random(minBlock, maxBlock + 1);
        while (count > 0) {
            const x = RandomUtility.random(0, this.board.width);
            const y = RandomUtility.random(0, this.board.height);

            if (this.board.get(x, y) !== OneStrokeWritingBoardCell.block) {
                this.board.set(x, y, OneStrokeWritingBoardCell.block);
                count--;
            }
        }
    }
}
