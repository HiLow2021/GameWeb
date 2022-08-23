import { OthelloBoardCell } from './enums/othelloBoardCell';

export class OthelloBoard {
    public readonly size: number;

    public readonly halfSize: number;

    public readonly cells: OthelloBoardCell[][];

    public constructor(size: number) {
        this.size = size;
        this.halfSize = size / 2;

        this.cells = new Array(size);
        for (let index = 0; index < size; index++) {
            this.cells[index] = new Array(size);
        }

        this.validate();
        this.initialize();
    }

    public initialize(): void {
        for (let y = 0; y < this.cells.length; y++) {
            for (let x = 0; x < this.cells[y].length; x++) {
                this.cells[y][x] = OthelloBoardCell.empty;
            }
        }
        this.cells[this.halfSize - 1][this.halfSize - 1] = OthelloBoardCell.white;
        this.cells[this.halfSize][this.halfSize - 1] = OthelloBoardCell.black;
        this.cells[this.halfSize - 1][this.halfSize] = OthelloBoardCell.black;
        this.cells[this.halfSize][this.halfSize] = OthelloBoardCell.white;
    }

    public get(x: number, y: number): OthelloBoardCell {
        if (!this.isWithinRange(x, y)) {
            return OthelloBoardCell.outOfRange;
        }

        return this.cells[y][x];
    }

    public getCount(cell: OthelloBoardCell): number {
        let count = 0;
        for (let y = 0; y < this.cells.length; y++) {
            for (let x = 0; x < this.cells[y].length; x++) {
                if (this.cells[y][x] === cell) {
                    count++;
                }
            }
        }

        return count;
    }

    public set(x: number, y: number, cell: OthelloBoardCell): void {
        if (!this.isWithinRange(x, y)) {
            return;
        }

        this.cells[y][x] = cell;
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
