import express, { NextFunction, Request, Response, Router } from 'express';
import { OthelloBoardCell } from '../shared/othello/enums/othelloBoardCell';
import { Turn } from '../shared/othello/enums/turn';
import { OthelloAIManager } from '../shared/othello/othelloAIManager';

const othelloRouter: Router = express.Router();

type RequestData = {
    cells: OthelloBoardCell[][];
    currentTurn: Turn;
};

type ResponseData = {
    x: number;
    y: number;
};

othelloRouter.post('/othello/next', (req: Request, res: Response, next: NextFunction): void => {
    try {
        const { cells, currentTurn } = req.body as RequestData;

        const othelloAIManager = new OthelloAIManager(cells.length);
        othelloAIManager.setBoard(cells, currentTurn);
        const position = othelloAIManager.monteCarloMethod(1000);

        const response = { x: position.x, y: position.y } as ResponseData;

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }

    next();
});

export default othelloRouter;
