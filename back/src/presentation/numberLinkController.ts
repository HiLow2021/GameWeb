import { GetNumberLinkQuestionQueryProcessor } from '../businessLogic/queryProcessors/getNumberLinkQuestionQueryProcessor';
import { ResultCode } from './enums/resultCode';
import { GetNumberLinkQuestionResponse } from './models';

export default class NumberLinkController {
    public static async getQuestion(width: number, height: number): Promise<GetNumberLinkQuestionResponse> {
        const processor = new GetNumberLinkQuestionQueryProcessor();
        const cells = await processor.execute(width, height);

        return {
            cells,
            result: {
                code: ResultCode.Succeeded,
                message: ''
            }
        };
    }
}
