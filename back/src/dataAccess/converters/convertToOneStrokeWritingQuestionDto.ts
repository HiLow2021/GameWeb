import { GameOneStrokeWritingQuestion } from '@prisma/client';
import { OneStrokeWritingBoardCell } from 'shared/game/oneStrokeWriting/enum/oneStrokeWritingBoardCell';
import { OneStrokeWritingQuestionDto } from '../../businessLogic/queries/oneStrokeWritingQuestionDto';

export const convertToOneStrokeWritingQuestionDto = (entity: Readonly<GameOneStrokeWritingQuestion>): OneStrokeWritingQuestionDto => {
    return JSON.parse(entity.cells) as OneStrokeWritingBoardCell[][];
};
