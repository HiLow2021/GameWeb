import { Config } from '../../config';
import { ArrayUtility } from '../../utility/arrayUtility';
import { IllustrationLogicBoardCell } from './enums/illustrationLogicBoardCell';
import { IllustrationLogicBoard } from './illustrationLogicBoard';

export class IllustrationLogicManager {
    private readonly _apiUrl = `${Config.apiUrl}/api/illustrationLogic/question`;

    private _question: IllustrationLogicBoardCell[][];

    private _isFinished = false;

    public readonly board: IllustrationLogicBoard;

    get isFinished(): boolean {
        return this._isFinished;
    }

    get hint(): [number[][], number[][]] {
        return this.getLengths(this._question);
    }

    public constructor(width: number, height: number) {
        this.board = new IllustrationLogicBoard(width, height);
        this._question = ArrayUtility.create2Array(width, height);
    }

    public async initialize(): Promise<void> {
        //ArrayUtility.copy2Array(json.cells, this._question);
        const arr = [
            ['on', 'off', 'off', 'on', 'on', 'off', 'off', 'on', 'off', 'on'],
            ['off', 'on', 'off', 'on', 'off', 'on', 'off', 'on', 'off', 'on'],
            ['off', 'off', 'on', 'off', 'on', 'off', 'on', 'off', 'on', 'off'],
            ['on', 'off', 'on', 'off', 'on', 'off', 'on', 'off', 'on', 'off'],
            ['on', 'off', 'on', 'off', 'on', 'off', 'on', 'off', 'on', 'off'],
            ['off', 'on', 'off', 'on', 'off', 'on', 'off', 'on', 'off', 'on'],
            ['off', 'off', 'on', 'off', 'on', 'off', 'on', 'off', 'on', 'off'],
            ['on', 'off', 'on', 'off', 'on', 'off', 'on', 'off', 'on', 'off'],
            ['off', 'on', 'off', 'on', 'off', 'on', 'off', 'on', 'off', 'on'],
            ['on', 'off', 'on', 'off', 'on', 'off', 'on', 'off', 'on', 'off']
        ];

        this._question = arr as IllustrationLogicBoardCell[][];
        this.reset();
    }

    public reset(): void {
        this._isFinished = false;
        this.board.initialize();
        ArrayUtility.copy2Array(this._question, this.board.cells)
    }

    public next(x: number, y: number): boolean {
        if (this.isFinished) {
            return false;
        }
        if (this.set(x, y)) {
            this.updateResult();
            return true;
        }

        return false;
    }

    private updateResult(): void {
        this._isFinished = this.board.cells.every((x, i) => x.every((y, j) => y === this._question[i][j]));
    }

    private set(x: number, y: number): boolean {
        const cell = this.board.get(x, y);
        if (cell === IllustrationLogicBoardCell.outOfRange) {
            return false;
        }

        if (cell === IllustrationLogicBoardCell.on) {
            this.board.set(x, y, IllustrationLogicBoardCell.off);
        } else if (cell === IllustrationLogicBoardCell.off) {
            this.board.set(x, y, IllustrationLogicBoardCell.on);
        }

        return true;
    }

    private getLengths(cells: IllustrationLogicBoardCell[][]): [number[][], number[][]] {
        const getLength = (array: IllustrationLogicBoardCell[]): number[] => {
            let flag = false;
            let count = 0;
            const result = [];
            for (const pixel of array) {
                if (pixel === IllustrationLogicBoardCell.on) {
                    count += 1;
                    if (!flag) {
                        flag = true;
                    }
                } else {
                    if (flag) {
                        result.push(count);
                        count = 0;
                        flag = false;
                    }
                }
            }
            if (flag) {
                result.push(count);
            }

            return result;
        };

        const rows = cells.map((x) => getLength(x));
        const cols = cells[0].map((_, i) => getLength(cells.map((x) => x[i])));

        return [rows, cols];
    }
}
