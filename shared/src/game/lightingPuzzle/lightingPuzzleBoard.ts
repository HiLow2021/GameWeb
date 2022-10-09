import { LightingPuzzleBoardCell } from './enum/lightingPuzzleBoardCell';

export class LightingPuzzleBoard {
    private _cells: LightingPuzzleBoardCell[][];

    public readonly width: number;

    public readonly height: number;

    get cells(): LightingPuzzleBoardCell[][] {
        return this._cells;
    }

    public constructor(width: number, height: number) {
        this.width = width;
        this.height = height;

        this._cells = new Array(height);
        for (let index = 0; index < height; index++) {
            this._cells[index] = new Array(width);
        }

        this.validate();
    }

    public initialize(): void {
        for (let y = 0; y < this._cells.length; y++) {
            for (let x = 0; x < this._cells[y].length; x++) {
                this._cells[y][x] = LightingPuzzleBoardCell.off;
            }
        }
    }

    public get(x: number, y: number): LightingPuzzleBoardCell {
        if (!this.isWithinRange(x, y)) {
            return LightingPuzzleBoardCell.outOfRange;
        }

        return this._cells[y][x];
    }

    public set(x: number, y: number, cell: LightingPuzzleBoardCell): void {
        if (!this.isWithinRange(x, y)) {
            return;
        }

        this._cells[y][x] = cell;
    }

    private isWithinRange(x: number, y: number): boolean {
        return 0 <= x && x < this.width && 0 <= y && y < this.height;
    }

    private validate(): void {
        if (this.width < 4) {
            throw new Error('横のサイズは4以上にしてください。');
        }
        if (this.height < 4) {
            throw new Error('縦のサイズは4以上にしてください。');
        }
    }
}
