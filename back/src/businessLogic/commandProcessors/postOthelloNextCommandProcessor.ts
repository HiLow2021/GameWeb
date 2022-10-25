import { OthelloAIManager } from 'shared/game/othello/othelloAIManager';
import { Vector } from 'shared/game/othello/vector';
import { OthelloNextCommand } from '../commands/othelloNextCommand';

export class PostOthelloNextCommandProcessor {
    public async execute(model: Readonly<OthelloNextCommand>): Promise<Vector> {
        const othelloAIManager = new OthelloAIManager(model.size);
        othelloAIManager.setBoard(model.cells, model.currentTurn);

        const position = othelloAIManager.monteCarloMethod(model.repeatCount);

        return position;
    }
}
