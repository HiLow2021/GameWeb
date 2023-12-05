import { Config } from '../../config';
import { ArrayUtility } from '../../utility/arrayUtility';
import { IllustrationLogicBoardCell } from './enums/illustrationLogicBoardCell';
import { IllustrationLogicBoard } from './illustrationLogicBoard';

export class IllustrationLogicManager {
    private readonly _apiUrl = `${Config.apiUrl}/api/illustrationLogic/question`;

    private _title: string;

    private _answer: IllustrationLogicBoardCell[][];

    private _isFinished = false;

    public readonly board: IllustrationLogicBoard;

    get title(): string {
        return this._title;
    }

    get isFinished(): boolean {
        return this._isFinished;
    }

    get hint(): [number[][], number[][]] {
        return this.getLengths(this._answer);
    }

    public constructor(width: number, height: number) {
        this.board = new IllustrationLogicBoard(width, height);
        this._title = '';
        this._answer = ArrayUtility.create2Array(width, height);
    }

    public async initialize(): Promise<void> {
        const params = new URLSearchParams({
            width: String(this.board.width),
            height: String(this.board.height)
        });
        const response = await fetch(`${this._apiUrl}?${params}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();

        this._title = json.title;
        ArrayUtility.copy2Array(json.cells, this._answer);
        this.reset();
    }

    public reset(): void {
        this._isFinished = false;
        this.board.initialize();
        ArrayUtility.copy2Array(this._answer, this.board.cells);
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
        this._isFinished = this.board.cells.every((x, i) =>
            x.every((y, j) =>
                this._answer[i][j] === IllustrationLogicBoardCell.On
                    ? y === IllustrationLogicBoardCell.On
                    : y === IllustrationLogicBoardCell.Off || y === IllustrationLogicBoardCell.Mark
            )
        );
    }

    private set(x: number, y: number): boolean {
        const cell = this.board.get(x, y);
        if (cell === IllustrationLogicBoardCell.OutOfRange) {
            return false;
        }

        if (cell === IllustrationLogicBoardCell.On) {
            this.board.set(x, y, IllustrationLogicBoardCell.Mark);
        } else if (cell === IllustrationLogicBoardCell.Off) {
            this.board.set(x, y, IllustrationLogicBoardCell.On);
        } else {
            this.board.set(x, y, IllustrationLogicBoardCell.Off);
        }

        return true;
    }

    private getLengths(cells: IllustrationLogicBoardCell[][]): [number[][], number[][]] {
        const getLength = (array: IllustrationLogicBoardCell[]): number[] => {
            let flag = false;
            let count = 0;
            const result = [];
            for (const pixel of array) {
                if (pixel === IllustrationLogicBoardCell.On) {
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
