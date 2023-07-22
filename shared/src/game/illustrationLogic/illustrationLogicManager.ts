import { Config } from '../../config';
import { ArrayUtility } from '../../utility/arrayUtility';

export class IllustrationLogicManager {
    private readonly _apiUrl = `${Config.apiUrl}/api/illustrationLogic/question`;

    //private _question: IllustrationLogicBoardCell[][];

    private _isFinished = false;

    //public readonly board: IllustrationLogicBoard;

    get isFinished(): boolean {
        return this._isFinished;
    }

    public constructor(width: number, height: number) {
        //this.board = new IllustrationLogicBoard(width, height);
        //this._question = ArrayUtility.create2Array(width, height);
    }

    public async initialize(): Promise<void> {
        //ArrayUtility.copy2Array(json.cells, this._question);
        this.reset();
    }

    public reset(): void {
        this._isFinished = false;
        //this.board.initialize(this._question);
    }

    // x と y は画面のマスにタッチした場所
    // direction はスワイプした方向とする
    public next(x: number, y: number): boolean {
        if (this.isFinished) {
            return false;
        }

        return false;
    }
}
