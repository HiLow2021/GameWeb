import { PostGomokuNextCommandProcessor } from '../businessLogic/commandProcessors/postGomokuNextCommandProcessor';
import { createGomokuNextCommand } from './factories/createGomokuNextCommand';
import { PostGomokuNextRequest, PostGomokuNextResponse } from './models';
import { ResultCode } from './enums/resultCode';

export default class GomokuController {
    public static async getNext(requestBody: Readonly<PostGomokuNextRequest>): Promise<PostGomokuNextResponse> {
        const model = createGomokuNextCommand(requestBody);

        const processor = new PostGomokuNextCommandProcessor();
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
