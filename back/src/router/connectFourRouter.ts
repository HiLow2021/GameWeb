import express, { NextFunction, Request, Response, Router } from 'express';
import { ConnectFourAIManager } from 'shared/game/connectFour/connectFourAIManager';
import { ConnectFourBoardCell } from 'shared/game/connectFour/enums/connectFourBoardCell';
import { Turn } from 'shared/game/connectFour/enums/turn';

const connectFourRouter: Router = express.Router();

type RequestData = {
    cells: ConnectFourBoardCell[][];
    currentTurn: Turn;
};

type ResponseData = {
    x: number;
    y: number;
};

connectFourRouter.post('/connectFour/next', (req: Request, res: Response, next: NextFunction): void => {
    try {
        const { cells, currentTurn } = req.body as RequestData;

        const connectFourAIManager = new ConnectFourAIManager(cells[0].length, cells.length);
        connectFourAIManager.setBoard(cells, currentTurn);
        const position = connectFourAIManager.basicMethod();

        const response = { x: position.x, y: position.y } as ResponseData;

        res.status(200).json(response);
    } catch (error) {
        next(error);
    }

    next();
});

export default connectFourRouter;
