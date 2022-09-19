import express, { NextFunction, Request, Response, Router } from 'express';
import { OthelloBoardCell } from 'shared/game/othello/enums/othelloBoardCell';
import { Turn } from 'shared/game/othello/enums/turn';
import { OthelloAIManager } from 'shared/game/othello/othelloAIManager';

const othelloRouter: Router = express.Router();

type RequestData = {
    cells: OthelloBoardCell[][];
    currentTurn: Turn;
    repeatCount: number;
};

type ResponseData = {
    x: number;
    y: number;
};

othelloRouter.post('/othello/next', (req: Request, res: Response, next: NextFunction): void => {
    try {
        const { cells, currentTurn, repeatCount } = req.body as RequestData;

        const othelloAIManager = new OthelloAIManager(cells.length);
        othelloAIManager.setBoard(cells, currentTurn);
        const position = othelloAIManager.monteCarloMethod(repeatCount);

        const response = { x: position.x, y: position.y } as ResponseData;

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }

    next();
});

export default othelloRouter;
