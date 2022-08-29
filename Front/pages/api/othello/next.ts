import type { NextApiRequest, NextApiResponse } from 'next';
import { OthelloBoardCell } from '../../../shared/othello/enums/othelloBoardCell';
import { Turn } from '../../../shared/othello/enums/turn';
import { OthelloAIManager } from '../../../shared/othello/othelloAIManager';

type RequestData = {
    cells: OthelloBoardCell[][];
    currentTurn: Turn;
};

type ResponseData = {
    x: number;
    y: number;
};

const handler = (req: NextApiRequest, res: NextApiResponse<ResponseData>): void => {
    const { cells, currentTurn } = JSON.parse(req.body) as RequestData;

    const othelloAIManager = new OthelloAIManager(cells.length);
    othelloAIManager.setBoard(cells, currentTurn);
    const position = othelloAIManager.monteCarloMethod(1000);

    res.status(200).json({ x: position.x, y: position.y });
};

export default handler;
