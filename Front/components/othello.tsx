import { useState } from 'react';
import { Ellipse, Layer, Line, Rect, Stage } from 'react-konva';
import { CellType } from '../shared/othello/cellType';
import { OthelloBoard } from '../shared/othello/othelloBoard';

type Coordinate = {
    x: number;
    y: number;
    color: string;
    shape: string;
};

const Othello = ({ width, height }: { width: number; height: number }): JSX.Element => {
    const cellCount = 8;
    const cellCountHalf = cellCount / 2;
    const cellWidth = width / cellCount;
    const cellHeight = height / cellCount;
    const strokeWidth = 4;
    const strokeWidthHalf = strokeWidth / 2;
    const othelloBoard = new OthelloBoard(cellCount);

    const [coordinates, setCoordinates] = useState<Coordinate[]>(convertCellTypesToStones(othelloBoard.cells));

    return (
        <>
            <Stage
                width={width}
                height={height}
                onClick={(e) => {
                    const x = Math.floor(e.evt.offsetX / cellWidth);
                    const y = Math.floor(e.evt.offsetY / cellHeight);

                    setCoordinates((coordinates) => [...coordinates, { x, y, color: 'black', shape: '' }]);
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
                    {[cellCountHalf - 2, cellCountHalf + 2].map((y) =>
                        [cellCountHalf - 2, cellCountHalf + 2].map((x) => (
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
                    {coordinates.map((coordinate) => (
                        <Ellipse
                            fill={coordinate.color}
                            x={cellWidth * coordinate.x + cellWidth / 2 + strokeWidthHalf}
                            y={cellHeight * coordinate.y + cellHeight / 2 + strokeWidthHalf}
                            radiusX={cellWidth / 3}
                            radiusY={cellHeight / 3}
                        />
                    ))}
                </Layer>
            </Stage>
        </>
    );
};

function convertCellTypesToStones(cellTypes: CellType[][]): Coordinate[] {
    const coordinates: Coordinate[] = [];
    for (let y = 0; y < cellTypes.length; y++) {
        for (let x = 0; x < cellTypes[y].length; x++) {
            let coordinate: Coordinate;

            switch (cellTypes[y][x]) {
                case 'black':
                    coordinate = { x, y, color: 'black', shape: 'ellipse' };
                    break;

                case 'white':
                    coordinate = { x, y, color: 'white', shape: 'ellipse' };
                    break;

                case 'highLight':
                    coordinate = { x, y, color: 'yellow', shape: 'rect' };
                    break;

                default:
                    coordinate = { x, y, color: '', shape: '' };
                    break;
            }

            coordinates.push(coordinate);
        }
    }

    return coordinates;
}

export default Othello;
