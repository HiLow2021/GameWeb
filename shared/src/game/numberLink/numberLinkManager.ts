import { Config } from '../../config';
import { ArrayUtility } from '../../utility/arrayUtility';
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

        ArrayUtility.copy2Array(json.cells, this._question);
        this.reset();
    }

    public reset(): void {
        this._isFinished = false;
        this.board.initialize(this._question);
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

    public getConnectedCells(x: number, y: number): NumberLinkBoardCell[][] {
        const result: NumberLinkBoardCell[][] = [];
        const startCell = this.board.get(x, y);
        if (!startCell) {
            return result;
        }

        for (const route of startCell.routes) {
            const cells = [startCell];
            let nextRoute: Vector | undefined = route;
            let nextCell = this.board.get(startCell.x + nextRoute.x, startCell.y + nextRoute.y);
            while (nextRoute && nextCell) {
                cells.push(nextCell);
                nextRoute = nextCell.routes.find((x) => (nextRoute ? !nextRoute.isOpposite(x) : false));
                if (!nextRoute) {
                    break;
                }

                nextCell = this.board.get(nextCell.x + nextRoute.x, nextCell.y + nextRoute.y);
            }

            result.push(cells);
        }

        return result;
    }

    private updateResult(): void {
        const count = this.board.cells.flat().filter((x) => x.number != undefined).length;

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
        if (!cell || !cell.number) {
            return false;
        }

        const connectedRoutes = this.getConnectedCells(x, y);
        if (connectedRoutes.length !== 1 || connectedRoutes[0].length <= 1) {
            return false;
        }

        const target = connectedRoutes[0][connectedRoutes[0].length - 1];

        return cell.number === target.number;
    }

    private canRouting(x: number, y: number, direction: Vector): boolean {
        if (!Vector.all.some((vector) => vector.isSame(direction))) {
            return false;
        }

        const cell1 = this.board.get(x, y);
        const cell2 = this.board.get(x + direction.x, y + direction.y);
        if (!cell1 || !cell2) {
            return false;
        }

        const isConnected = cell1.routes.some((route) => route.isSame(direction));
        const count1 = cell1.routes.length;
        const count2 = cell2.routes.length;
        if (!isConnected && ((cell1.number ? count1 === 1 : count1 === 2) || (cell2.number ? count2 === 1 : count2 === 2))) {
            return false;
        }

        const getNumber = (x: number, y: number): number | undefined => {
            const cells = this.getConnectedCells(x, y).flat();
            const numberCells = cells.filter((x) => x.number != undefined);

            return numberCells.length > 0 ? numberCells[0].number : undefined;
        };

        const number1 = cell1.number ? cell1.number : getNumber(x, y);
        const number2 = cell2.number ? cell2.number : getNumber(x + direction.x, y + direction.y);
        if (number1 && number2 && number1 !== number2) {
            return false;
        }

        return true;
    }

    private routing(x: number, y: number, direction: Vector): boolean {
        if (!this.canRouting(x, y, direction)) {
            return false;
        }

        const routingInner = (x: number, y: number, direction: Vector): boolean => {
            const cell = this.board.get(x, y);
            if (!cell) {
                return false;
            }

            const index = cell.routes.findIndex((route) => route.isSame(direction));
            if (index !== -1) {
                cell.routes.splice(index, 1);
            } else {
                cell.routes.push(direction);
            }

            return true;
        };

        return routingInner(x, y, direction) && routingInner(x + direction.x, y + direction.y, direction.opposite());
    }
}
