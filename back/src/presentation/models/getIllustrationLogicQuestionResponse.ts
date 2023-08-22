import { IllustrationLogicBoardCell } from 'shared/game/illustrationLogic/enums/illustrationLogicBoardCell';
import { Response } from './response';

export type GetIllustrationLogicQuestionResponse = Response & {
    cells: IllustrationLogicBoardCell[][];
};
