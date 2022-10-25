import { OthelloNextCommand } from '../../businessLogic/commands/othelloNextCommand';
import { PostOthelloNextRequest } from '../models';

export const createOthelloNextCommand = (requestBody: Readonly<PostOthelloNextRequest>): OthelloNextCommand => {
    return new OthelloNextCommand(requestBody.cells, requestBody.currentTurn, requestBody.repeatCount);
};
