import { Config } from '../../config';
import { OthelloBoardCell } from './enums/othelloBoardCell';
import { OthelloManagerBase } from './othelloManagerBase';

export class OthelloManager extends OthelloManagerBase {
    private readonly _apiUrl = `${Config.apiUrl}/api/othello/next`;

    public initialize(): void {
        super.initialize();
        this.setHighLight(this.currentStone);
    }

    public next(x: number, y: number): boolean {
        if (super.next(x, y)) {
            this.setHighLight(this.currentStone);

            return true;
        }

        return false;
    }

    public async nextByAI(repeatCount: number): Promise<boolean> {
        if (this.isFinished) {
            false;
        }

        const response = await fetch(this._apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cells: this.board.cells, currentTurn: this.currentTurn, repeatCount })
        });
        const position = await response.json();

        return this.next(position.x, position.y);
    }

    private setHighLight(chip: OthelloBoardCell): void {
        this.board.reset(OthelloBoardCell.HighLight);

        for (let x = 0; x < this.board.size; x++) {
            for (let y = 0; y < this.board.size; y++) {
                if (this.canPut(x, y, chip)) {
                    this.board.set(x, y, OthelloBoardCell.HighLight);
                }
            }
        }
    }
}
