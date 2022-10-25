import { environment } from '../../environment';
import { GomokuManagerBase } from './gomokuManagerBase';

export class GomokuManager extends GomokuManagerBase {
    private readonly _apiUrl = `${environment.baseUrl}/api/gomoku/next`;

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
