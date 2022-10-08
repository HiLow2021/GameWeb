import { RandomUtility } from '../../utility/randomUtility';
import { LightsOutBoardCell } from './enum/lightsOutBoardCell';
import { LightsOutBoard } from './lightsOutBoard';
import { Vector } from './vector';

export class LightsOutManager {
    private _step = 0;

    public readonly board: LightsOutBoard;

    get step(): number {
        return this._step;
    }

    get isCompleted(): boolean {
        return this.board.cells.flat().every((x) => x === LightsOutBoardCell.off);
    }

    public constructor(width: number, height: number) {
        this.board = new LightsOutBoard(width, height);

        this.initialize();
    }

    public initialize(): void {
        this.board.initialize();
        this.shuffle();
        this._step = 0;
    }

    public next(x: number, y: number): boolean {
        if (this.board.get(x, y) === LightsOutBoardCell.outOfRange) {
            return false;
        }

        for (const direction of Vector.all) {
            const chip1 = this.board.get(x + direction.x, y + direction.y);
            if (chip1 === LightsOutBoardCell.outOfRange) {
                continue;
            }

            const chip2 = chip1 === LightsOutBoardCell.on ? LightsOutBoardCell.off : LightsOutBoardCell.on;

            this.board.set(x + direction.x, y + direction.y, chip2);
        }

        this._step++;

        return true;
    }

    private shuffle(step = 1000): void {
        while (step-- > 0) {
            const x = RandomUtility.random(0, this.board.width);
            const y = RandomUtility.random(0, this.board.height);

            this.next(x, y);
        }
    }
}
