import Button from '@mui/material/Button';
import { useState } from 'react';
import { Ellipse, Layer, Line, Rect, Stage, Text } from 'react-konva';
import { CommonUtility } from '../shared/commonUtility';
import { OthelloBoardCell } from '../shared/game/othello/enums/othelloBoardCell';
import { Turn } from '../shared/game/othello/enums/turn';
import { OthelloBoard } from '../shared/game/othello/othelloBoard';
import { OthelloManager } from '../shared/game/othello/othelloManager';

type Coordinate = {
    x: number;
    y: number;
    color: string;
    stone: boolean;
};

const Othello = ({ width, height }: { width: number; height: number }): JSX.Element => {
    const size = 8;
    const sizeHalf = size / 2;
    const cellWidth = width / size;
    const cellHeight = height / size;
    const textAreaHeight = 80;
    const strokeWidth = 4;
    const strokeWidthHalf = strokeWidth / 2;

    const [othelloManager] = useState<OthelloManager>(new OthelloManager(size));
    const [coordinates, setCoordinates] = useState<Coordinate[]>(convertCellsToStones(othelloManager.board.cells));
    const [mouseCoordinate, setMouseCoordinate] = useState<Coordinate>();
    const [canClick, setCanClick] = useState(true);

    const buttonStyle = { fontSize: 24 };

    return (
        <>
            <div className="flex flex-col gap-4 justify-center">
                <Stage
                    width={width + strokeWidth}
                    height={height + strokeWidth + textAreaHeight}
                    onClick={async (e) => {
                        if (!canClick) {
                            return;
                        }

                        const x = Math.floor(e.evt.offsetX / cellWidth);
                        const y = Math.floor(e.evt.offsetY / cellHeight);

                        if (othelloManager.next(x, y)) {
                            setCanClick((_) => false);
                            setCoordinates((_) => convertCellsToStones(othelloManager.board.cells));

                            while (isOpponent(othelloManager.currentTurn)) {
                                await CommonUtility.delay(100);
                                await othelloManager.nextByAI();

                                setCoordinates((_) => convertCellsToStones(othelloManager.board.cells));
                            }

                            setCanClick((_) => true);
                        }
                    }}
                    onMouseMove={(e) => {
                        const x = Math.floor(e.evt.offsetX / cellWidth);
                        const y = Math.floor(e.evt.offsetY / cellHeight);

                        setMouseCoordinate((_) => ({ x, y, color: 'pink', stone: false }));
                    }}
                >
                    <Layer key="othello-board-layer">
                        <Rect fill="green" width={width} height={height} />
                        <Rect
                            stroke="black"
                            strokeWidth={strokeWidth}
                            x={strokeWidthHalf}
                            y={strokeWidthHalf}
                            width={width}
                            height={height}
                        />
                        {[...Array(size - 1)].map((_, i) => (
                            <Line
                                stroke="black"
                                strokeWidth={strokeWidth}
                                points={[cellWidth * (i + 1) + strokeWidthHalf, 0, cellWidth * (i + 1) + strokeWidthHalf, height]}
                            />
                        ))}
                        {[...Array(size - 1)].map((_, i) => (
                            <Line
                                stroke="black"
                                strokeWidth={strokeWidth}
                                points={[0, cellHeight * (i + 1) + strokeWidthHalf, width, cellHeight * (i + 1) + strokeWidthHalf]}
                            />
                        ))}
                        {[sizeHalf - 2, sizeHalf + 2].map((y) =>
                            [sizeHalf - 2, sizeHalf + 2].map((x) => (
                                <Ellipse
                                    fill="black"
                                    x={cellWidth * x + strokeWidthHalf}
                                    y={cellHeight * y + strokeWidthHalf}
                                    radiusX={cellWidth / 10}
                                    radiusY={cellHeight / 10}
                                />
                            ))
                        )}
                    </Layer>
                    <Layer key="othello-cell-layer">
                        {coordinates.map((coordinate) =>
                            coordinate.stone ? (
                                <Ellipse
                                    fill={coordinate.color}
                                    x={cellWidth * coordinate.x + cellWidth / 2 + strokeWidthHalf}
                                    y={cellHeight * coordinate.y + cellHeight / 2 + strokeWidthHalf}
                                    radiusX={cellWidth / 3}
                                    radiusY={cellHeight / 3}
                                />
                            ) : !isOpponent(othelloManager.currentTurn) ? (
                                <Rect
                                    stroke={coordinate.color}
                                    strokeWidth={strokeWidth}
                                    x={cellWidth * coordinate.x + strokeWidth + strokeWidthHalf}
                                    y={cellHeight * coordinate.y + strokeWidth + strokeWidthHalf}
                                    width={cellWidth - strokeWidth * 2}
                                    height={cellHeight - strokeWidth * 2}
                                />
                            ) : (
                                <></>
                            )
                        )}
                    </Layer>
                    <Layer key="othello-mouse-layer">
                        {mouseCoordinate && mouseCoordinate.y < size ? (
                            <Rect
                                stroke={mouseCoordinate.color}
                                strokeWidth={strokeWidth}
                                x={cellWidth * mouseCoordinate.x + strokeWidth + strokeWidthHalf}
                                y={cellHeight * mouseCoordinate.y + strokeWidth + strokeWidthHalf}
                                width={cellWidth - strokeWidth * 2}
                                height={cellHeight - strokeWidth * 2}
                            />
                        ) : (
                            <></>
                        )}
                    </Layer>
                    <Layer key="othello-text-layer">
                        <Rect fill="#505050" x={0} y={height + strokeWidth} width={width + strokeWidth} height={textAreaHeight} />
                        <Rect
                            stroke="black"
                            strokeWidth={strokeWidth}
                            x={strokeWidthHalf}
                            y={height + strokeWidthHalf}
                            width={width}
                            height={textAreaHeight}
                        />
                        <Ellipse
                            fill="black"
                            x={cellWidth + strokeWidthHalf}
                            y={height + cellHeight / 2 + strokeWidthHalf}
                            radiusX={cellWidth / 3}
                            radiusY={cellHeight / 3}
                        />
                        <Text
                            text={displayCount(othelloManager.board, OthelloBoardCell.black)}
                            x={cellWidth / 2}
                            y={height}
                            width={cellWidth + strokeWidth}
                            height={textAreaHeight}
                            fill="white"
                            fontSize={32}
                            align="center"
                            verticalAlign="middle"
                        />
                        <Ellipse
                            fill="white"
                            x={cellWidth * (size - 1) + strokeWidthHalf}
                            y={height + cellHeight / 2 + strokeWidthHalf}
                            radiusX={cellWidth / 3}
                            radiusY={cellHeight / 3}
                        />
                        <Text
                            text={displayCount(othelloManager.board, OthelloBoardCell.white)}
                            x={cellWidth * (size - 1) - cellWidth / 2}
                            y={height}
                            width={cellWidth + strokeWidth}
                            height={textAreaHeight}
                            fill="black"
                            fontSize={32}
                            align="center"
                            verticalAlign="middle"
                        />
                        <Text
                            text={displayText(othelloManager.board, othelloManager.currentTurn)}
                            x={0}
                            y={height}
                            width={width}
                            height={textAreaHeight}
                            fill="white"
                            fontSize={32}
                            align="center"
                            verticalAlign="middle"
                        />
                    </Layer>
                </Stage>
                <div className="flex justify-end">
                    <Button
                        className="h-12 w-48"
                        fullWidth={false}
                        variant="contained"
                        color="success"
                        style={buttonStyle}
                        onClick={() => {
                            if (!canClick) {
                                return;
                            }

                            othelloManager.initialize();
                            setCoordinates((_) => convertCellsToStones(othelloManager.board.cells));
                        }}
                    >
                        リセット
                    </Button>
                </div>
            </div>
        </>
    );
};

function convertCellsToStones(cells: OthelloBoardCell[][]): Coordinate[] {
    const coordinates: Coordinate[] = [];
    for (let y = 0; y < cells.length; y++) {
        for (let x = 0; x < cells[y].length; x++) {
            let coordinate: Coordinate;

            switch (cells[y][x]) {
                case 'black':
                    coordinate = { x, y, color: 'black', stone: true };
                    break;

                case 'white':
                    coordinate = { x, y, color: 'white', stone: true };
                    break;

                case 'highLight':
                    coordinate = { x, y, color: 'orange', stone: false };
                    break;

                default:
                    continue;
            }

            coordinates.push(coordinate);
        }
    }

    return coordinates;
}

function isOpponent(currentTurn: Turn): boolean {
    return currentTurn === 'white';
}

function displayCount(board: OthelloBoard, cell: OthelloBoardCell): string {
    return board.getCount(cell).toString();
}

function displayText(board: OthelloBoard, currentTurn: Turn): string {
    const blackCount = board.getCount(OthelloBoardCell.black);
    const whiteCount = board.getCount(OthelloBoardCell.white);

    let text = '';
    if (currentTurn === Turn.black) {
        text = 'プレイヤーのターンです';
    } else if (currentTurn === Turn.white) {
        text = 'AIのターンです';
    } else if (currentTurn === Turn.finished && blackCount > whiteCount) {
        text = 'プレイヤーの勝利です';
    } else if (currentTurn === Turn.finished && whiteCount > blackCount) {
        text = 'AIの勝利です';
    } else if (currentTurn === Turn.finished && blackCount === whiteCount) {
        text = '引き分けです';
    }

    return text;
}

export default Othello;
