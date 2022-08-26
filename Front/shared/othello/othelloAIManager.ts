import { OthelloBoardCell } from './enums/othelloBoardCell';
import { Turn } from './enums/turn';
import { Vector } from './vector';
import { OthelloBoard } from './othelloBoard';

export class OthelloAIManager {
    private _currentTurn: Turn = Turn.black;

    public readonly board: OthelloBoard;

    get currentStone(): OthelloBoardCell {
        return this.currentTurn === Turn.black ? OthelloBoardCell.black : OthelloBoardCell.white;
    }

    get currentTurn(): Turn {
        return this._currentTurn;
    }

    get isFinished(): boolean {
        return this.currentTurn === Turn.finished;
    }

    public constructor(size: number) {
        this.board = new OthelloBoard(size);
        this.initialize();
    }

    public initialize(): void {
        this._currentTurn = Turn.black;
        this.board.initialize();
    }

    public setBoard(cells: OthelloBoardCell[][], currentTurn: Turn): void {
        this.board.setAll(cells);
        this._currentTurn = currentTurn;
    }

    public randomMethod(): Vector {
        let x, y;

        do {
            x = this.random(0, this.board.size);
            y = this.random(0, this.board.size);
        } while (!this.canPut(x, y, this.currentStone));

        return new Vector(x, y);
    }

    private rotateTurn(): void {
        const canBlackTurn = this.canPutAll(OthelloBoardCell.black);
        const canWhiteTurn = this.canPutAll(OthelloBoardCell.white);

        if (!canBlackTurn && !canWhiteTurn) {
            this._currentTurn = Turn.finished;
        } else if (this._currentTurn === Turn.black && canWhiteTurn) {
            this._currentTurn = Turn.white;
        } else if (this._currentTurn === Turn.white && canBlackTurn) {
            this._currentTurn = Turn.black;
        }
    }

    private canPut(x: number, y: number, chip: OthelloBoardCell): boolean {
        const currentChip = this.board.get(x, y);
        if (currentChip !== OthelloBoardCell.empty && currentChip !== OthelloBoardCell.highLight) {
            return false;
        }

        for (const v of Vector.all) {
            if (this.reverse(x, y, v.x, v.y, chip, true) > 0) {
                return true;
            }
        }

        return false;
    }

    private canPutAll(chip: OthelloBoardCell): boolean {
        for (let x = 0; x < this.board.size; x++) {
            for (let y = 0; y < this.board.size; y++) {
                if (this.canPut(x, y, chip)) {
                    return true;
                }
            }
        }

        return false;
    }

    private put(x: number, y: number, chip: OthelloBoardCell): boolean {
        if (!this.canPut(x, y, chip)) {
            return false;
        }

        let count = 0;
        for (const v of Vector.all) {
            count += this.reverse(x, y, v.x, v.y, chip);
        }
        if (count > 0) {
            this.board.set(x, y, chip);
        }

        return count > 0;
    }

    private reverse(x1: number, y1: number, dx: number, dy: number, chip1: OthelloBoardCell, isSearchOnly = false): number {
        x1 += dx;
        y1 += dy;

        let x2 = x1;
        let y2 = y1;
        let count = 0;
        const chip2 = this.board.get(x2, y2);

        if (this.canSearch(chip1, chip2)) {
            do {
                x2 += dx;
                y2 += dy;
            } while (this.board.get(x2, y2) === chip2);

            if (this.board.get(x2, y2) === chip1) {
                do {
                    x2 -= dx;
                    y2 -= dy;
                    count++;

                    if (!isSearchOnly) {
                        this.board.set(x2, y2, chip1);
                    }
                } while (!(x1 === x2 && y1 === y2));
            }
        }

        return count;
    }

    private canSearch(chip1: OthelloBoardCell, chip2: OthelloBoardCell): boolean {
        return (
            (chip1 == OthelloBoardCell.black && chip2 == OthelloBoardCell.white) ||
            (chip2 == OthelloBoardCell.black && chip1 == OthelloBoardCell.white)
        );
    }

    private random(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min) + min);
    }
}