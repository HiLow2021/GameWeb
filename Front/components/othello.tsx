import { useState } from 'react';
import { Ellipse, Layer, Line, Rect, Stage } from 'react-konva';

type Stone = {
    x: number;
    y: number;
    color: string;
};

const Othello = ({ width, height }: { width: number; height: number }): JSX.Element => {
    const cellCount = 8;
    const cellCountHalf = cellCount / 2;
    const cellWidth = width / cellCount;
    const cellHeight = height / cellCount;
    const strokeWidth = 4;
    const strokeWidthHalf = strokeWidth / 2;

    const [stones, setStones] = useState<Stone[]>([
        { x: cellCountHalf - 1, y: cellCountHalf - 1, color: 'white' },
        { x: cellCountHalf - 1, y: cellCountHalf, color: 'black' },
        { x: cellCountHalf, y: cellCountHalf - 1, color: 'black' },
        { x: cellCountHalf, y: cellCountHalf, color: 'white' }
    ]);

    return (
        <>
            <Stage
                width={width}
                height={height}
                onClick={(e) => {
                    const x = Math.floor(e.evt.offsetX / cellWidth);
                    const y = Math.floor(e.evt.offsetY / cellHeight);

                    setStones((stone) => [...stone, { x, y, color: 'black' }]);
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
                    {stones.map((stone) => (
                        <Ellipse
                            fill={stone.color}
                            x={cellWidth * stone.x + cellWidth / 2 + strokeWidthHalf}
                            y={cellHeight * stone.y + cellHeight / 2 + strokeWidthHalf}
                            radiusX={cellWidth / 3}
                            radiusY={cellHeight / 3}
                        />
                    ))}
                </Layer>
            </Stage>
        </>
    );
};

export default Othello;
