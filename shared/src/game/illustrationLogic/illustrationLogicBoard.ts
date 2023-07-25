import { ArrayUtility } from '../../utility/arrayUtility';
import { IllustrationLogicBoardCell } from './enums/illustrationLogicBoardCell';

export class IllustrationLogicBoard {
    private _cells: IllustrationLogicBoardCell[][];

    public readonly width: number;

    public readonly height: number;

    get cells(): IllustrationLogicBoardCell[][] {
        return this._cells;
    }

    public constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this._cells = ArrayUtility.create2Array(width, height);

        this.validate();
    }

    public initialize(): void {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this._cells[y][x] = IllustrationLogicBoardCell.off;
            }
        }
    }

    public get(x: number, y: number): IllustrationLogicBoardCell {
        if (!this.isWithinRange(x, y)) {
            return IllustrationLogicBoardCell.outOfRange;
        }

        return this._cells[y][x];
    }

    public set(x: number, y: number, cell: IllustrationLogicBoardCell): void {
        if (!this.isWithinRange(x, y)) {
            return;
        }

        this._cells[y][x] = cell;
    }

    private isWithinRange(x: number, y: number): boolean {
        return 0 <= x && x < this.width && 0 <= y && y < this.height;
    }

    private validate(): void {
        if (this.width < 5) {
            throw new Error('横のサイズは5以上にしてください。');
        }
        if (this.height < 5) {
            throw new Error('縦のサイズは5以上にしてください。');
        }
    }
}
