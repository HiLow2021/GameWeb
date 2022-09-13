import { Button } from '@mui/material';
import { useState } from 'react';
import { Ellipse, Layer, Line, Rect, Stage } from 'react-konva';

type Coordinate = {
    x: number;
    y: number;
    color: string;
};

const Gomoku = ({ width, height }: { width: number; height: number }): JSX.Element => {
    const widthSize = 14;
    const heightSize = 14;
    const widthSizeHalf = Math.floor(widthSize / 2);
    const heightSizeHalf = Math.floor(heightSize / 2);
    const strokeWidth = 4;
    const strokeWidthHalf = strokeWidth / 2;
    const cellWidth = (width - strokeWidth * 2 - strokeWidth * widthSize) / widthSize;
    const cellHeight = (height - strokeWidth * 2 - strokeWidth * heightSize) / heightSize;
    const cellWidthHalf = cellWidth / 2;
    const cellHeightHalf = cellHeight / 2;

    const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
    const [canClick, setCanClick] = useState(true);

    const buttonStyle = { fontSize: 24 };

    return (
        <>
            <div className="flex flex-col gap-4 justify-center">
                <Stage
                    width={width}
                    height={height}
                    onClick={async (e) => {
                        if (!canClick) {
                            return;
                        }

                        const x = Math.floor((e.evt.offsetX - strokeWidth) / (cellWidth + strokeWidth));
                        const y = Math.floor((e.evt.offsetY - strokeWidth) / (cellHeight + strokeWidth));

                        setCanClick((_) => false);
                        setCoordinates((prev) => [...prev, { x, y, color: 'black', stone: true }]);
                        setCanClick((_) => true);
                    }}
                >
                    <Layer key="gomoku-board-layer">
                        <Rect fill="#f5deb3" width={width} height={height} />
                        <Rect
                            stroke="black"
                            strokeWidth={strokeWidth}
                            x={strokeWidthHalf}
                            y={strokeWidthHalf}
                            width={width - strokeWidth}
                            height={height - strokeWidth}
                        />
                        {[...Array(widthSize + 1)].map((_, i) => (
                            <Line
                                stroke="black"
                                strokeWidth={strokeWidth}
                                points={[
                                    cellWidthHalf + (cellWidth + strokeWidth) * i + strokeWidth + strokeWidthHalf,
                                    cellHeightHalf + strokeWidth + strokeWidthHalf,
                                    cellWidthHalf + (cellWidth + strokeWidth) * i + strokeWidth + strokeWidthHalf,
                                    height - cellHeightHalf - strokeWidth
                                ]}
                            />
                        ))}
                        {[...Array(heightSize + 1)].map((_, i) => (
                            <Line
                                stroke="black"
                                strokeWidth={strokeWidth}
                                points={[
                                    cellWidthHalf + strokeWidth,
                                    cellHeightHalf + (cellHeight + strokeWidth) * i + strokeWidth + strokeWidthHalf,
                                    width - cellWidthHalf - strokeWidth,
                                    cellHeightHalf + (cellHeight + strokeWidth) * i + strokeWidth + strokeWidthHalf
                                ]}
                            />
                        ))}
                        {[heightSizeHalf - 4, heightSizeHalf + 3].map((y) =>
                            [widthSizeHalf - 4, widthSizeHalf + 3].map((x) => (
                                <Ellipse
                                    fill="black"
                                    x={cellWidthHalf + (cellWidth + strokeWidth) * x + strokeWidth + strokeWidthHalf}
                                    y={cellHeightHalf + (cellHeight + strokeWidth) * y + strokeWidth + strokeWidthHalf}
                                    radiusX={cellWidth / 6}
                                    radiusY={cellHeight / 6}
                                />
                            ))
                        )}
                    </Layer>
                    <Layer key="gomoku-cell-layer">
                        {coordinates.map((coordinate) => (
                            <Ellipse
                                fill="black"
                                x={cellWidthHalf + (cellWidth + strokeWidth) * coordinate.x + strokeWidth + strokeWidthHalf}
                                y={cellHeightHalf + (cellHeight + strokeWidth) * coordinate.y + strokeWidth + strokeWidthHalf}
                                radiusX={cellWidth / 2.5}
                                radiusY={cellHeight / 2.5}
                            />
                        ))}
                    </Layer>
                </Stage>
                <div className="flex justify-end">
                    <Button
                        className="h-12 w-48"
                        fullWidth={false}
                        variant="contained"
                        color="warning"
                        style={buttonStyle}
                        onClick={() => {
                            if (!canClick) {
                                return;
                            }

                            setCoordinates((_) => []);
                        }}
                    >
                        リセット
                    </Button>
                </div>
            </div>
        </>
    );
};

export default Gomoku;