import { environment } from '../../environment';
import { ConnectFourManagerBase } from './connectFourManagerBase';
import { ConnectFourBoardCell } from './enums/connectFourBoardCell';

export class ConnectFourManager extends ConnectFourManagerBase {
    private readonly _apiUrl = `${environment.baseUrl}/api/connectFour/next`;

    public initialize(): void {
        super.initialize();
        this.setHighLight();
    }

    public next(x: number, y: number): boolean {
        if (super.next(x, y)) {
            this.setHighLight();

            return true;
        }

        return false;
    }

    public async nextByAI(): Promise<boolean> {
        if (this.isFinished) {
            false;
        }

        const response = await fetch(this._apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cells: this.board.cells, currentTurn: this.currentTurn })
        });
        const position = await response.json();

        return this.next(position.x, position.y);
    }

    private setHighLight(): void {
        this.board.reset(ConnectFourBoardCell.highLight);

        for (let x = 0; x < this.board.width; x++) {
            for (let y = 0; y < this.board.height; y++) {
                if (this.canPut(x, y)) {
                    this.board.set(x, y, ConnectFourBoardCell.highLight);
                }
            }
        }
    }
}
