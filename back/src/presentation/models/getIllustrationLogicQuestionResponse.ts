import { IllustrationLogicBoardCell } from 'shared/game/illustrationLogic/enums/illustrationLogicBoardCell';
import { Result } from './result';

export type GetIllustrationLogicQuestionResponse = {
    cells: IllustrationLogicBoardCell[][];

    result: Result;
};
