import express, { NextFunction, Request, Response, Router } from 'express';
import { GomokuBoardCell } from '../shared/gomoku/enums/gomokuBoardCell';
import { Turn } from '../shared/gomoku/enums/turn';
import { GomokuAIManager } from '../shared/gomoku/gomokuAIManager';

const gomokuRouter: Router = express.Router();

type RequestData = {
    cells: GomokuBoardCell[][];
    currentTurn: Turn;
};

type ResponseData = {
    x: number;
    y: number;
};

gomokuRouter.post('/gomoku/next', (req: Request, res: Response, next: NextFunction): void => {
    try {
        const { cells, currentTurn } = req.body as RequestData;

        const gomokuAIManager = new GomokuAIManager(cells[0].length, cells.length);
        gomokuAIManager.setBoard(cells, currentTurn);
        const position = gomokuAIManager.simpleMethod();

        const response = { x: position.x, y: position.y } as ResponseData;

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }

    next();
});

export default gomokuRouter;
