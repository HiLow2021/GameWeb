import { ConnectFourAIManager } from 'shared/game/connectFour/connectFourAIManager';
import { Vector } from 'shared/game/connectFour/vector';
import { ConnectFourNextCommand } from '../commands/connectFourNextCommand';

export class PostConnectFourNextCommandProcessor {
    public async execute(model: Readonly<ConnectFourNextCommand>): Promise<Vector> {
        const connectFourAIManager = new ConnectFourAIManager(model.width, model.height);
        connectFourAIManager.setBoard(model.cells, model.currentTurn);

        const position = connectFourAIManager.basicMethod();

        return position;
    }
}
