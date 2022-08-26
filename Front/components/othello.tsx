import { useState } from 'react';
import { Ellipse, Layer, Line, Rect, Stage } from 'react-konva';
import { CommonUtility } from '../shared/commonUtility';
import { OthelloBoardCell } from '../shared/othello/enums/othelloBoardCell';
import { OthelloManager } from '../shared/othello/othelloManager';

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
    const strokeWidth = 4;
    const strokeWidthHalf = strokeWidth / 2;

    const [othelloManager] = useState<OthelloManager>(new OthelloManager(size));
    const [coordinates, setCoordinates] = useState<Coordinate[]>(convertCellsToStones(othelloManager.board.cells));
    const [mouseCoordinate, setMouseCoordinate] = useState<Coordinate>();
    const [canClick, setCanClick] = useState(true);
    const [isOpponent] = useState(() => () => othelloManager.currentTurn === 'white');

    return (
        <>
            <Stage
                width={width}
                height={height}
                onClick={async (e) => {
                    if (!canClick) {
                        return;
                    }

                    const x = Math.floor(e.evt.offsetX / cellWidth);
                    const y = Math.floor(e.evt.offsetY / cellHeight);

                    if (othelloManager.next(x, y)) {
                        setCanClick((_) => false);
                        setCoordinates((_) => convertCellsToStones(othelloManager.board.cells));

                        while (isOpponent()) {
                            await CommonUtility.delay(1000);
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
                        width={width - strokeWidth}
                        height={height - strokeWidth}
                    />
                    {[...Array(7)].map((_, i) => (
                        <Line
                            stroke="black"
                            strokeWidth={strokeWidth}
                            points={[cellWidth * (i + 1) + strokeWidthHalf, 0, cellWidth * (i + 1) + strokeWidthHalf, height]}
                        />
                    ))}
                    {[...Array(7)].map((_, i) => (
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
                <Layer key="othello-stone-layer">
                    {coordinates.map((coordinate) =>
                        coordinate.stone ? (
                            <Ellipse
                                fill={coordinate.color}
                                x={cellWidth * coordinate.x + cellWidth / 2 + strokeWidthHalf}
                                y={cellHeight * coordinate.y + cellHeight / 2 + strokeWidthHalf}
                                radiusX={cellWidth / 3}
                                radiusY={cellHeight / 3}
                            />
                        ) : !isOpponent() ? (
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
                <Layer>
                    {mouseCoordinate ? (
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
            </Stage>
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

export default Othello;
