import { GomokuBoardCell } from './enums/gomokuBoardCell';

export class GomokuBoard {
    private _cells: GomokuBoardCell[][];

    public readonly width: number;

    public readonly height: number;

    get square(): number {
        return this.width * this.height;
    }

    get cells(): GomokuBoardCell[][] {
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
                this._cells[y][x] = GomokuBoardCell.empty;
            }
        }
    }

    public get(x: number, y: number): GomokuBoardCell {
        if (!this.isWithinRange(x, y)) {
            return GomokuBoardCell.outOfRange;
        }

        return this._cells[y][x];
    }

    public getCount(cell: GomokuBoardCell): number {
        let count = 0;
        for (let y = 0; y < this._cells.length; y++) {
            for (let x = 0; x < this._cells[y].length; x++) {
                if (this._cells[y][x] === cell) {
                    count++;
                }
            }
        }

        return count;
    }

    public set(x: number, y: number, cell: GomokuBoardCell): void {
        if (!this.isWithinRange(x, y)) {
            return;
        }

        this._cells[y][x] = cell;
    }

    public setAll(cells: GomokuBoardCell[][]): void {
        this._cells = cells;
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
