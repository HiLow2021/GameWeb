import { Config } from '../../config';
import { ArrayUtility } from '../../utility/arrayUtility';
import { NumberLinkBoardCellType } from './enum/numberLinkBoardCellType';
import { NumberLinkBoard } from './numberLinkBoard';
import { NumberLinkBoardCell } from './type/numberLinkBoardCell';
import { Vector } from './vector';

export class NumberLinkManager {
    private readonly _apiUrl = `${Config.apiUrl}/api/numberLink/question`;

    private _question: NumberLinkBoardCell[][];

    private _isFinished = false;

    public readonly board: NumberLinkBoard;

    get isFinished(): boolean {
        return this._isFinished;
    }

    public constructor(width: number, height: number) {
        this.board = new NumberLinkBoard(width, height);
        this._question = ArrayUtility.create2Array(width, height);
        ArrayUtility.copy2Array(this.board.cells, this._question);
    }

    public async initialize(): Promise<void> {
        const cells = [
            [2, null, null, null, null],
            [1, null, null, 3, null],
            [null, null, null, null, null],
            [null, 2, null, null, 1],
            [null, null, null, null, 3]
        ];
        const convertedCells: NumberLinkBoardCell[][] = cells.map((x) =>
            x.map((y) => ({
                type: y ? NumberLinkBoardCellType.number : NumberLinkBoardCellType.none,
                number: y ? y : undefined,
                routes: []
            }))
        );

        ArrayUtility.copy2Array(convertedCells, this._question);
        this.reset();
    }

    public reset(): void {
        this._isFinished = false;
        ArrayUtility.copy2Array(this._question, this.board.cells);
    }

    // x と y は画面のマスにタッチした場所
    // direction はスワイプした方向とする
    public next(x: number, y: number, direction: Vector): boolean {
        if (this.isFinished) {
            return false;
        }

        if (this.routing(x, y, direction)) {
            this.updateResult();

            return true;
        }

        return false;
    }

    public getConnectedPositions(x: number, y: number): Vector[][] {
        const result: Vector[][] = [];
        const startCell = this.board.get(x, y);
        if (!startCell) {
            return result;
        }

        for (let i = 0; i < startCell.routes.length; i++) {
            const positions = [];
            const currentPosition = new Vector(x, y);
            positions.push(currentPosition);
            let nextRoute: Vector | undefined = startCell.routes[i];
            while (nextRoute) {
                currentPosition.x += nextRoute.x;
                currentPosition.y += nextRoute.y;
                const nextCell = this.board.get(currentPosition.x, currentPosition.y);
                if (!nextCell) {
                    break;
                }

                const isConnected = nextCell.routes.some((x) => nextRoute?.isOpposite(x) ?? false);
                if (isConnected) {
                    positions.push(new Vector(currentPosition.x, currentPosition.y));
                    nextRoute = nextCell.routes.find((x) => !nextRoute?.isOpposite(x));
                } else {
                    break;
                }
            }

            result.push(positions);
        }

        return result;
    }

    private updateResult(): void {
        const cells = this.board.cells.flat();
        const count = cells.filter((x) => x.type === NumberLinkBoardCellType.number).map((x) => x.number).length;

        let i = 0;
        for (let y = 0; y < this.board.height; y++) {
            for (let x = 0; x < this.board.width; x++) {
                if (this.checkNumberConnection(x, y)) {
                    i++;
                }
            }
        }

        if (i === count) {
            this._isFinished = true;
        }
    }

    private checkNumberConnection(x: number, y: number): boolean {
        const cell = this.board.get(x, y);
        if (!cell || cell.type !== NumberLinkBoardCellType.number) {
            return false;
        }

        const connectedRoutes = this.getConnectedPositions(x, y);
        if (connectedRoutes.length !== 1 || connectedRoutes[0].length <= 1) {
            return false;
        }

        const target = connectedRoutes[0][connectedRoutes[0].length - 1];
        const targetCell = this.board.get(target.x, target.y);
        if (!cell.number || !targetCell?.number) {
            return false;
        }

        return cell.number === targetCell.number;
    }

    private routing(x1: number, y1: number, direction: Vector): boolean {
        const x2 = x1 + direction.x;
        const y2 = y1 + direction.y;
        if (!this.canRouting(x1, y1) || !this.canRouting(x2, y2)) {
            return false;
        }

        return this.doRouting(x1, y1, direction) && this.doRouting(x2, y2, direction.opposite());
    }

    private canRouting(x: number, y: number): boolean {
        const cell = this.board.get(x, y);
        if (!cell) {
            return false;
        }

        const count = cell.routes.length;

        return cell.type === NumberLinkBoardCellType.number ? count < 1 : count < 2;
    }

    private doRouting(x: number, y: number, direction: Vector): boolean {
        const cell = this.board.get(x, y);
        if (!cell) {
            return false;
        }

        const index = cell.routes.findIndex((route) => route.x === direction.x && route.x === direction.y);
        if (index !== -1) {
            cell.routes.splice(index, 1);
        } else {
            cell.routes.push(direction);
        }

        return true;
    }
}
