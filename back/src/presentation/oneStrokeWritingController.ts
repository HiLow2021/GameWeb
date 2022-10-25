import { GetOneStrokeWritingQuestionQueryProcessor } from '../businessLogic/queryProcessors/getOneStrokeWritingQuestionQueryProcessor';
import { ResultCode } from './enums/resultCode';
import { GetOneStrokeWritingQuestionResponse } from './models';

export default class OneStrokeWritingController {
    public static async getQuestion(width: number, height: number, straight: boolean): Promise<GetOneStrokeWritingQuestionResponse> {
        const processor = new GetOneStrokeWritingQuestionQueryProcessor();
        const cells = await processor.execute(width, height, straight);

        return {
            cells,
            result: {
                code: ResultCode.Succeeded,
                message: ''
            }
        };
    }
}
