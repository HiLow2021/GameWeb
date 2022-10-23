import { GomokuAIManager } from 'shared/game/gomoku/gomokuAIManager';
import { Vector } from 'shared/game/gomoku/vector';
import { GomokuNextCommand } from '../commands/gomokuNextCommand';

export class PostGomokuNextCommandProcessor {
    public async execute(model: Readonly<GomokuNextCommand>): Promise<Vector> {
        const gomokuAIManager = new GomokuAIManager(model.width, model.height);
        gomokuAIManager.setBoard(model.cells, model.currentTurn);

        const position = gomokuAIManager.basicMethod();

        return position;
    }
}
