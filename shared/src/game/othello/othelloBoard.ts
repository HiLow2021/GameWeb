import { OthelloBoardCell } from './enums/othelloBoardCell';

export class OthelloBoard {
    private _cells: OthelloBoardCell[][];

    public readonly size: number;

    get halfSize(): number {
        return this.size / 2;
    }

    get cells(): OthelloBoardCell[][] {
        return this._cells;
    }

    public constructor(size: number) {
        this.size = size;

        this._cells = new Array(size);
        for (let index = 0; index < size; index++) {
            this._cells[index] = new Array(size);
        }

        this.validate();
    }

    public initialize(): void {
        for (let y = 0; y < this._cells.length; y++) {
            for (let x = 0; x < this._cells[y].length; x++) {
                this._cells[y][x] = OthelloBoardCell.Empty;
            }
        }
        this._cells[this.halfSize - 1][this.halfSize - 1] = OthelloBoardCell.White;
        this._cells[this.halfSize][this.halfSize - 1] = OthelloBoardCell.Black;
        this._cells[this.halfSize - 1][this.halfSize] = OthelloBoardCell.Black;
        this._cells[this.halfSize][this.halfSize] = OthelloBoardCell.White;
    }

    public get(x: number, y: number): OthelloBoardCell {
        if (!this.isWithinRange(x, y)) {
            return OthelloBoardCell.OutOfRange;
        }

        return this._cells[y][x];
    }

    public set(x: number, y: number, cell: OthelloBoardCell): void {
        if (!this.isWithinRange(x, y)) {
            return;
        }

        this._cells[y][x] = cell;
    }

    public setAll(cells: OthelloBoardCell[][]): void {
        this._cells = cells;
    }

    public getCount(cell: OthelloBoardCell): number {
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

    public reset(cell: OthelloBoardCell): void {
        for (let y = 0; y < this._cells.length; y++) {
            for (let x = 0; x < this._cells[y].length; x++) {
                if (this._cells[y][x] === cell) {
                    this._cells[y][x] = OthelloBoardCell.Empty;
                }
            }
        }
    }

    private isWithinRange(x: number, y: number): boolean {
        return 0 <= x && x < this.size && 0 <= y && y < this.size;
    }

    private validate(): void {
        if (this.size < 3) {
            throw new Error('盤面のサイズは3以上にしてください。');
        }
    }
}
