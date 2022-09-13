import { GomokuBoardCell } from './enums/gomokuBoardCell';
import { Turn } from './enums/turn';
import { GomokuBoard } from './gomokuBoard';

export abstract class GomokuManagerBase {
    protected _currentTurn: Turn = Turn.black;

    public readonly board: GomokuBoard;

    get currentStone(): GomokuBoardCell {
        return this.currentTurn === Turn.black ? GomokuBoardCell.black : GomokuBoardCell.white;
    }

    get currentTurn(): Turn {
        return this._currentTurn;
    }

    get isFinished(): boolean {
        return this.currentTurn === Turn.finished;
    }

    public constructor(width: number, height: number) {
        this.board = new GomokuBoard(width, height);
        this.initialize();
    }

    public initialize(): void {
        this._currentTurn = Turn.black;
        this.board.initialize();
    }

    public next(x: number, y: number): boolean {
        if (this.isFinished) {
            return false;
        }

        if (this.put(x, y, this.currentStone)) {
            this.rotateTurn();

            return true;
        }

        return false;
    }

    protected rotateTurn(): void {}

    protected canPut(x: number, y: number): boolean {
        return this.board.get(x, y) === GomokuBoardCell.empty;
    }

    protected put(x: number, y: number, chip: GomokuBoardCell): boolean {
        if (!this.canPut(x, y)) {
            return false;
        }

        this.board.set(x, y, chip);

        return true;
    }
}
