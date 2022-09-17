import { Button } from '@mui/material';
import { useState } from 'react';
import { Ellipse, FastLayer, Line, Rect, Stage, Text } from 'react-konva';
import { CommonUtility } from 'shared/utility/commonUtility';
import { GomokuBoardCell } from 'shared/game/gomoku/enums/gomokuBoardCell';
import { Result } from 'shared/game/gomoku/enums/result';
import { Turn } from 'shared/game/gomoku/enums/turn';
import { GomokuManager } from 'shared/game/gomoku/gomokuManager';

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
    const textAreaHeight = 80;

    const [gomokuManager] = useState<GomokuManager>(new GomokuManager(widthSize, heightSize));
    const [coordinates, setCoordinates] = useState<Coordinate[]>(convertCellsToCoordinates(gomokuManager.board.cells));
    const [canClick, setCanClick] = useState(true);

    const buttonStyle = { fontSize: 24 };

    return (
        <>
            <div className="flex flex-col gap-4 justify-center">
                <Stage
                    width={width}
                    height={height + textAreaHeight}
                    onClick={async (e) => {
                        if (!canClick) {
                            return;
                        }

                        const x = Math.floor((e.evt.offsetX - strokeWidth) / (cellWidth + strokeWidth));
                        const y = Math.floor((e.evt.offsetY - strokeWidth) / (cellHeight + strokeWidth));

                        if (gomokuManager.next(x, y)) {
                            setCanClick((_) => false);
                            setCoordinates((_) => convertCellsToCoordinates(gomokuManager.board.cells));

                            await CommonUtility.delay(100);
                            await gomokuManager.nextByAI();

                            setCoordinates((_) => convertCellsToCoordinates(gomokuManager.board.cells));
                            setCanClick((_) => true);
                        }
                    }}
                >
                    <FastLayer key="gomoku-board-layer">
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
                    </FastLayer>
                    <FastLayer key="gomoku-cell-layer">
                        {coordinates.map((coordinate) => (
                            <Ellipse
                                fill={coordinate.color}
                                x={cellWidthHalf + (cellWidth + strokeWidth) * coordinate.x + strokeWidth + strokeWidthHalf}
                                y={cellHeightHalf + (cellHeight + strokeWidth) * coordinate.y + strokeWidth + strokeWidthHalf}
                                radiusX={cellWidth / 2.5}
                                radiusY={cellHeight / 2.5}
                            />
                        ))}
                    </FastLayer>
                    <FastLayer key="gomoku-text-layer">
                        <Rect fill="#606060" x={0} y={height} width={width} height={textAreaHeight} />
                        <Rect
                            stroke="black"
                            strokeWidth={strokeWidth}
                            x={strokeWidthHalf}
                            y={height - strokeWidthHalf}
                            width={width - strokeWidth}
                            height={textAreaHeight}
                        />
                        <Text
                            text={displayText(gomokuManager.result, gomokuManager.currentTurn)}
                            x={0}
                            y={height}
                            width={width}
                            height={textAreaHeight}
                            fill="white"
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
                        color="warning"
                        style={buttonStyle}
                        onClick={() => {
                            if (!canClick) {
                                return;
                            }

                            gomokuManager.initialize();
                            setCoordinates((_) => convertCellsToCoordinates(gomokuManager.board.cells));
                        }}
                    >
                        リセット
                    </Button>
                </div>
            </div>
        </>
    );
};

function convertCellsToCoordinates(cells: GomokuBoardCell[][]): Coordinate[] {
    const coordinates: Coordinate[] = [];
    for (let y = 0; y < cells.length; y++) {
        for (let x = 0; x < cells[y].length; x++) {
            let coordinate: Coordinate;

            switch (cells[y][x]) {
                case 'black':
                    coordinate = { x, y, color: 'black' };
                    break;

                case 'white':
                    coordinate = { x, y, color: 'white' };
                    break;

                default:
                    continue;
            }

            coordinates.push(coordinate);
        }
    }

    return coordinates;
}

function displayText(result: Result, turn: Turn): string {
    if (result === Result.black) {
        return 'プレイヤーの勝利です';
    } else if (result === Result.white) {
        return 'AIの勝利です';
    } else if (result === Result.draw) {
        return '引き分けです';
    } else if (result === Result.undecided && turn === Turn.black) {
        return 'プレイヤーのターンです';
    } else if (result === Result.undecided && turn === Turn.white) {
        return 'AIのターンです';
    } else {
        return '';
    }
}

export default Gomoku;
