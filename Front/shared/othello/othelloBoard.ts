import { CellType } from './cellType';

export class OthelloBoard {
    public readonly size: number;

    public readonly halfSize: number;

    public readonly cells: CellType[][];

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
                this.cells[y][x] = CellType.empty;
            }
        }
        this.cells[this.halfSize - 1][this.halfSize - 1] = CellType.white;
        this.cells[this.halfSize][this.halfSize - 1] = CellType.black;
        this.cells[this.halfSize - 1][this.halfSize] = CellType.black;
        this.cells[this.halfSize][this.halfSize] = CellType.white;
    }

    public get(x: number, y: number): CellType {
        if (!this.isWithinRange(x, y)) {
            return CellType.outOfRange;
        }

        return this.cells[y][x];
    }

    public getCount(cellType: CellType): number {
        let count = 0;
        for (let y = 0; y < this.cells.length; y++) {
            for (let x = 0; x < this.cells[y].length; x++) {
                if (this.cells[y][x] === cellType) {
                    count++;
                }
            }
        }

        return count;
    }

    public set(x: number, y: number, cellType: CellType): void {
        if (!this.isWithinRange(x, y)) {
            return;
        }

        this.cells[y][x] = cellType;
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
