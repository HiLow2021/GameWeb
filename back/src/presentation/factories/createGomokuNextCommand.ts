import { GomokuNextCommand } from '../../businessLogic/commands/gomokuNextCommand';
import { PostGomokuNextRequest } from '../models';

export const createGomokuNextCommand = (requestBody: Readonly<PostGomokuNextRequest>): GomokuNextCommand => {
    return new GomokuNextCommand(requestBody.cells, requestBody.currentTurn);
};
