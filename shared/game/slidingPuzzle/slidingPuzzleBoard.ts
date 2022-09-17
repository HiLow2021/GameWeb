import { Vector } from './vector';

export class SlidingPuzzleBoard {
    private _cells: number[][];

    public readonly width: number;

    public readonly height: number;

    get square(): number {
        return this.width * this.height;
    }

    get cells(): number[][] {
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
        let i = 0;
        for (let y = 0; y < this._cells.length; y++) {
            for (let x = 0; x < this._cells[y].length; x++) {
                this._cells[y][x] = i++;
            }
        }
    }

    public find(number: number): Vector | undefined {
        for (let y = 0; y < this._cells.length; y++) {
            for (let x = 0; x < this._cells[y].length; x++) {
                if (this._cells[y][x] === number) {
                    return new Vector(x, y);
                }
            }
        }

        return undefined;
    }

    public get(x: number, y: number): number | undefined {
        if (!this.isWithinRange(x, y)) {
            return undefined;
        }

        return this._cells[y][x];
    }

    public swap(x1: number, y1: number, x2: number, y2: number): boolean {
        if (!this.isWithinRange(x1, y1) || !this.isWithinRange(x2, y2)) {
            return false;
        }

        const temp = this._cells[y2][x2];
        this._cells[y2][x2] = this._cells[y1][x1];
        this._cells[y1][x1] = temp;

        return true;
    }

    private isWithinRange(x: number, y: number): boolean {
        return 0 <= x && x < this.width && 0 <= y && y < this.height;
    }

    private validate(): void {
        if (this.width < 3) {
            throw new Error('横のサイズは3以上にしてください。');
        }
        if (this.height < 3) {
            throw new Error('縦のサイズは3以上にしてください。');
        }
    }
}
