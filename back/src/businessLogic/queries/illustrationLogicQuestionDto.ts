import { IllustrationLogicBoardCell } from 'shared/game/illustrationLogic/enums/illustrationLogicBoardCell';

export type IllustrationLogicQuestionDto = {
    title: string;

    cells: IllustrationLogicBoardCell[][];
};
