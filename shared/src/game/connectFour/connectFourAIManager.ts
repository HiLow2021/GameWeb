import { RandomUtility } from '../../utility/randomUtility';
import { ConnectFourManagerBase } from './connectFourManagerBase';
import { ConnectFourBoardCell } from './enums/connectFourBoardCell';
import { Turn } from './enums/turn';
import { Vector } from './vector';

export class ConnectFourAIManager extends ConnectFourManagerBase {
    get opponentStone(): ConnectFourBoardCell {
        return this.currentStone === ConnectFourBoardCell.black ? ConnectFourBoardCell.white : ConnectFourBoardCell.black;
    }

    public setBoard(cells: ConnectFourBoardCell[][], currentTurn: Turn): void {
        this.board.setAll(cells);
        this._currentTurn = currentTurn;
    }

    public randomMethod(min = new Vector(0, 0), max = new Vector(this.board.width, this.board.height)): Vector {
        let x: number, y: number;

        do {
            x = RandomUtility.random(min.x, max.x);
            y = RandomUtility.random(min.y, max.y);
        } while (!this.canPut(x, y));

        return new Vector(x, y);
    }
}
