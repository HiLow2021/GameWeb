import { useState } from 'react';
import { Ellipse, Layer, Line, Rect, Stage } from 'react-konva';
import { OthelloBoardCell } from '../shared/othello/enums/othelloBoardCell';
import { OthelloManager } from '../shared/othello/othelloManager';

type Coordinate = {
    x: number;
    y: number;
    color: string;
    shape: string;
};

const Othello = ({ width, height }: { width: number; height: number }): JSX.Element => {
    const size = 8;
    const sizeHalf = size / 2;
    const cellWidth = width / size;
    const cellHeight = height / size;
    const strokeWidth = 4;
    const strokeWidthHalf = strokeWidth / 2;
    const othelloManager = new OthelloManager(size);

    const [coordinates, setCoordinates] = useState<Coordinate[]>(convertCellsToStones(othelloManager.board.cells));

    return (
        <>
            <Stage
                width={width}
                height={height}
                onClick={(e) => {
                    const x = Math.floor(e.evt.offsetX / cellWidth);
                    const y = Math.floor(e.evt.offsetY / cellHeight);

                    if (othelloManager.next(x, y)) {
                        setCoordinates((coordinates) => [...coordinates, { x, y, color: 'black', shape: '' }]);
                    }
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

function convertCellsToStones(cells: OthelloBoardCell[][]): Coordinate[] {
    const coordinates: Coordinate[] = [];
    for (let y = 0; y < cells.length; y++) {
        for (let x = 0; x < cells[y].length; x++) {
            let coordinate: Coordinate;

            switch (cells[y][x]) {
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
