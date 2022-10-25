import { PostConnectFourNextCommandProcessor } from '../businessLogic/commandProcessors/postConnectFourNextCommandProcessor';
import { createConnectFourNextCommand } from './factories/createConnectFourNextCommand';
import { PostConnectFourNextRequest, PostConnectFourNextResponse } from './models';
import { ResultCode } from './enums/resultCode';

export default class ConnectFourController {
    public static async getNext(requestBody: Readonly<PostConnectFourNextRequest>): Promise<PostConnectFourNextResponse> {
        const model = createConnectFourNextCommand(requestBody);

        const processor = new PostConnectFourNextCommandProcessor();
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
