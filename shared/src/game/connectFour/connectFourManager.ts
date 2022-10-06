import { ConnectFourManagerBase } from './connectFourManagerBase';

export class ConnectFourManager extends ConnectFourManagerBase {
    private readonly _apiUrl = 'http://localhost:5000/api/connectFour/next';

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
}
