import { ConnectFourBoardCell } from './enums/connectFourBoardCell';

export class ConnectFourBoard {
    private _cells: ConnectFourBoardCell[][];

    public readonly width: number;

    public readonly height: number;

    get square(): number {
        return this.width * this.height;
    }

    get cells(): ConnectFourBoardCell[][] {
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
                this._cells[y][x] = ConnectFourBoardCell.empty;
            }
        }
    }

    public get(x: number, y: number): ConnectFourBoardCell {
        if (!this.isWithinRange(x, y)) {
            return ConnectFourBoardCell.outOfRange;
        }

        return this._cells[y][x];
    }

    public set(x: number, y: number, cell: ConnectFourBoardCell): void {
        if (!this.isWithinRange(x, y)) {
            return;
        }

        this._cells[y][x] = cell;
    }

    public setAll(cells: ConnectFourBoardCell[][]): void {
        this._cells = cells;
    }

    public reset(cell: ConnectFourBoardCell): void {
        for (let y = 0; y < this._cells.length; y++) {
            for (let x = 0; x < this._cells[y].length; x++) {
                if (this._cells[y][x] === cell) {
                    this._cells[y][x] = ConnectFourBoardCell.empty;
                }
            }
        }
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
