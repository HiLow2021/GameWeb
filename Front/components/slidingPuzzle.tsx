import { Button } from '@mui/material';
import { useState } from 'react';
import { FastLayer, Group, Rect, Stage, Text } from 'react-konva';
import { SlidingPuzzleManager } from '../shared/game/slidingPuzzle/slidingPuzzleManager';

type Coordinate = {
    x: number;
    y: number;
    number?: number;
    correct?: boolean;
};

const SlidingPuzzle = ({ width, height }: { width: number; height: number }): JSX.Element => {
    const widthSize = 4;
    const heightSize = 4;
    const outerStrokeWidth = 20;
    const outerStrokeWidthHalf = outerStrokeWidth / 2;
    const innerStrokeWidth = 2;
    const innerStrokeWidthHalf = innerStrokeWidth / 2;
    const cellWidth = (width - outerStrokeWidth * 2) / widthSize;
    const cellHeight = (height - outerStrokeWidth * 2) / heightSize;
    const textAreaHeight = 80;
    const textAreaMargin = 24;
    const textStrokeWidth = 4;
    const textStrokeWidthHalf = textStrokeWidth / 2;
    const missingNumber = widthSize * heightSize - 1;

    const [slidingPuzzleManager] = useState<SlidingPuzzleManager>(new SlidingPuzzleManager(widthSize, heightSize, missingNumber));
    const [coordinates, setCoordinates] = useState<Coordinate[]>(convertCellsToCoordinates(slidingPuzzleManager.board.cells));
    const [canClick, setCanClick] = useState(true);

    const buttonStyle = { fontSize: 24 };

    const getTargetCell = (offsetX: number, offsetY: number): Coordinate | undefined => {
        const x = Math.floor((offsetX - outerStrokeWidth) / cellWidth);
        const y = Math.floor((offsetY - outerStrokeWidth) / cellHeight);

        return { x, y };
    };

    return (
        <>
            <div className="flex flex-col gap-4 justify-center">
                <Stage
                    width={width}
                    height={height + textAreaHeight + textAreaMargin}
                    onClick={async (e) => {
                        if (!canClick || slidingPuzzleManager.isSorted) {
                            return;
                        }

                        const target = getTargetCell(e.evt.offsetX, e.evt.offsetY);
                        if (!target) {
                            return;
                        }

                        if (slidingPuzzleManager.slide(target.x, target.y)) {
                            setCanClick((_) => false);

                            setCoordinates((_) => convertCellsToCoordinates(slidingPuzzleManager.board.cells));

                            setCanClick((_) => true);
                        }
                    }}
                >
                    <FastLayer key="sliding-puzzle-board-layer">
                        <Rect
                            stroke="black"
                            strokeWidth={outerStrokeWidth}
                            x={outerStrokeWidthHalf}
                            y={outerStrokeWidthHalf}
                            width={width - outerStrokeWidth}
                            height={height - outerStrokeWidth}
                        />
                    </FastLayer>
                    <FastLayer key="sliding-puzzle-piece-layer">
                        {coordinates.map((coordinate) =>
                            coordinate.number !== missingNumber ? (
                                <Group>
                                    <Rect
                                        x={cellWidth * coordinate.x + outerStrokeWidth}
                                        y={cellHeight * coordinate.y + outerStrokeWidth}
                                        width={cellWidth}
                                        height={cellHeight}
                                        fillPriority="linear-gradient"
                                        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                                        fillLinearGradientEndPoint={{ x: cellWidth, y: cellHeight }}
                                        fillLinearGradientColorStops={[0, '#EEEEEE', 1, '#BBBBBB']}
                                    />
                                    <Rect
                                        stroke="#888888"
                                        strokeWidth={innerStrokeWidth}
                                        x={cellWidth * coordinate.x + outerStrokeWidth + innerStrokeWidthHalf}
                                        y={cellHeight * coordinate.y + outerStrokeWidth + innerStrokeWidthHalf}
                                        width={cellWidth - innerStrokeWidth}
                                        height={cellHeight - innerStrokeWidth}
                                    />
                                    <Text
                                        text={coordinate.number != undefined ? (coordinate.number + 1).toString() : ''}
                                        x={cellWidth * coordinate.x + outerStrokeWidth + innerStrokeWidthHalf}
                                        y={cellHeight * coordinate.y + outerStrokeWidth + innerStrokeWidthHalf}
                                        width={cellWidth}
                                        height={cellHeight}
                                        fill={coordinate.correct ? '#0088FF' : '#666666'}
                                        fontSize={32}
                                        align="center"
                                        verticalAlign="middle"
                                    />
                                </Group>
                            ) : (
                                <></>
                            )
                        )}
                    </FastLayer>
                    <FastLayer key="sliding-puzzle-text-layer">
                        <Rect fill="#DDDDDD" x={0} y={height + textAreaMargin} width={width} height={textAreaHeight} />
                        <Rect
                            stroke="black"
                            strokeWidth={textStrokeWidth}
                            x={textStrokeWidthHalf}
                            y={height + textAreaMargin + textStrokeWidthHalf}
                            width={width - textStrokeWidth}
                            height={textAreaHeight - textStrokeWidth}
                        />
                        <Text
                            text={`Step ${slidingPuzzleManager.step}`}
                            x={0}
                            y={height + textAreaMargin}
                            width={width / 2}
                            height={textAreaHeight}
                            fill="black"
                            fontSize={32}
                            align="center"
                            verticalAlign="middle"
                        />
                        <Text
                            text={slidingPuzzleManager.isSorted ? 'クリア！' : ''}
                            x={width / 2}
                            y={height + textAreaMargin}
                            width={width / 2}
                            height={textAreaHeight}
                            fill="#FF2200"
                            fontSize={32}
                            align="center"
                            verticalAlign="middle"
                        />
                    </FastLayer>
                </Stage>
                <div className="flex justify-end">
                    <Button
                        className="h-12 w-48"
                        fullWidth={false}
                        variant="contained"
                        color="primary"
                        style={buttonStyle}
                        onClick={() => {
                            if (!canClick) {
                                return;
                            }

                            slidingPuzzleManager.initialize();
                            setCoordinates((_) => convertCellsToCoordinates(slidingPuzzleManager.board.cells));
                        }}
                    >
                        リセット
                    </Button>
                </div>
            </div>
        </>
    );
};

function convertCellsToCoordinates(cells: number[][]): Coordinate[] {
    const coordinates: Coordinate[] = [];
    for (let y = 0; y < cells.length; y++) {
        for (let x = 0; x < cells[y].length; x++) {
            coordinates.push({ x, y, number: cells[y][x], correct: y * cells.length + x === cells[y][x] });
        }
    }

    return coordinates;
}

export default SlidingPuzzle;
