import { ConnectFourNextCommand } from '../../businessLogic/commands/connectFourNextCommand';
import { PostConnectFourNextRequest } from '../models';

export const createConnectFourNextCommand = (requestBody: Readonly<PostConnectFourNextRequest>): ConnectFourNextCommand => {
    return new ConnectFourNextCommand(requestBody.cells, requestBody.currentTurn);
};
