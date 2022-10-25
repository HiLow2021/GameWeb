import { PostOthelloNextCommandProcessor } from '../businessLogic/commandProcessors/postOthelloNextCommandProcessor';
import { ResultCode } from './enums/resultCode';
import { createOthelloNextCommand } from './factories/createOthelloNextCommand';
import { PostOthelloNextRequest, PostOthelloNextResponse } from './models';

export default class OthelloController {
    public static async getNext(requestBody: Readonly<PostOthelloNextRequest>): Promise<PostOthelloNextResponse> {
        const model = createOthelloNextCommand(requestBody);

        const processor = new PostOthelloNextCommandProcessor();
        const position = await processor.execute(model);

        return {
            x: position.x,
            y: position.y,
            result: {
                code: ResultCode.Succeeded,
                message: ''
            }
        };
    }
}
