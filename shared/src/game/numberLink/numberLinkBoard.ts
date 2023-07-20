import { NumberLinkBoardCellType } from './enum/numberLinkBoardCellType';
import { NumberLinkBoardCell } from './type/numberLinkBoardCell';

export class NumberLinkBoard {
    private _cells: NumberLinkBoardCell[][];

    public readonly width: number;

    public readonly height: number;

    get cells(): NumberLinkBoardCell[][] {
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
                this._cells[y][x] = {
                    type: NumberLinkBoardCellType.none,
                    routes: []
                };
            }
        }
    }

    public get(x: number, y: number): NumberLinkBoardCell | undefined {
        if (!this.isWithinRange(x, y)) {
            return undefined;
        }

        return this._cells[y][x];
    }

    public setType(x: number, y: number, type: NumberLinkBoardCellType): void {
        if (!this.isWithinRange(x, y)) {
            return;
        }

        this._cells[y][x].type = type;
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
