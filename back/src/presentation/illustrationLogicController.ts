import { GetIllustrationLogicQuestionQueryProcessor } from '../businessLogic/queryProcessors/getIllustrationLogicQuestionQueryProcessor';
import { ResultCode } from './enums/resultCode';
import { GetIllustrationLogicQuestionResponse } from './models';

export default class IllustrationLogicController {
    public static async getQuestion(width: number, height: number): Promise<GetIllustrationLogicQuestionResponse> {
        const processor = new GetIllustrationLogicQuestionQueryProcessor();
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
