import { Button, FormControl, FormLabel, MenuItem, Select } from '@mui/material';
import { KonvaEventObject } from 'konva/lib/Node';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Layer, Rect, Stage, Text } from 'react-konva';
import { OneStrokeWritingBoardCell } from 'shared/game/oneStrokeWriting/enum/oneStrokeWritingBoardCell';
import { Result } from 'shared/game/oneStrokeWriting/enum/result';
import { OneStrokeWritingManager } from 'shared/game/oneStrokeWriting/oneStrokeWritingManager';
import { CommonUtility } from 'shared/utility/commonUtility';
import { Coordinate } from '../../shared/game/oneStrokeWriting/coordinate';
import { getGameComponentSize } from '../../shared/utility/componentUtility';
import { useContextSound } from '../../shared/utility/soundUtility';

const OneStrokeWriting = (): JSX.Element => {
    const { width, height, small } = getGameComponentSize();

    const strokeWidth = small ? 10 : 20;
    const strokeWidthHalf = strokeWidth / 2;
    const margin = 2;
    const textAreaHeight = small ? 44 : 80;
    const textAreaMargin = 16;
    const textStrokeWidth = small ? 2 : 4;
    const textStrokeWidthHalf = textStrokeWidth / 2;

    const [size, setSize] = useState(6);
    const [cellWidth, setCellWidth] = useState((width - strokeWidth * 2) / size);
    const [cellHeight, setCellHeight] = useState((height - strokeWidth * 2) / size);
    const [oneStrokeWritingManager, setOneStrokeWritingManager] = useState<OneStrokeWritingManager>(
        new OneStrokeWritingManager(size, size)
    );
    const [coordinates, setCoordinates] = useState<Coordinate[]>(convertCellsToCoordinates(oneStrokeWritingManager));
    const [canClick, setCanClick] = useState(true);
    const [initial, setInitial] = useState(true);

    const startSound = useContextSound('game/oneStrokeWriting/sound.mp3');

    const initialize = async () => {
        await oneStrokeWritingManager.initialize();
        setCoordinates(() => convertCellsToCoordinates(oneStrokeWritingManager));
    };

    const select = async (e: KonvaEventObject<Event>): Promise<void> => {
        if (!canClick) {
            return;
        }

        const [x, y] = convert(e);
        if (oneStrokeWritingManager.next(x, y)) {
            setCanClick(() => false);

            setCoordinates(() => convertCellsToCoordinates(oneStrokeWritingManager));
            startSound();

            setCanClick(() => true);
        }

        function convert(e: KonvaEventObject<Event>): number[] {
            const stage = e.target.getStage();
            const position = stage?.getPointerPosition();
            if (!position) {
                return [-1, -1];
            }

            const x = Math.floor((position.x - strokeWidth) / cellWidth);
            const y = Math.floor((position.y - strokeWidth) / cellHeight);

            return [x, y];
        }
    };

    const result = async (): Promise<void> => {
        if (oneStrokeWritingManager.result === Result.undecided) {
            return;
        }

        if (oneStrokeWritingManager.result === Result.failed) {
            await CommonUtility.delay(200);

            oneStrokeWritingManager.reset();
        }

        setCoordinates(() => convertCellsToCoordinates(oneStrokeWritingManager));
    };

    useEffect(() => {
        if (initial) {
            return;
        }

        setOneStrokeWritingManager(new OneStrokeWritingManager(size, size));
    }, [size, size]);

    useEffect(() => {
        if (initial) {
            return;
        }

        initialize();
    }, [oneStrokeWritingManager]);

    useEffect(() => {
        result();
    }, [oneStrokeWritingManager.result]);

    useEffect(() => {
        setInitial(false);
        initialize();
    }, []);

    useLayoutEffect(() => {
        setCellWidth((width - strokeWidth * 2) / size);
        setCellHeight((height - strokeWidth * 2) / size);
        setCoordinates(() => convertCellsToCoordinates(oneStrokeWritingManager));
    }, [oneStrokeWritingManager, width, height]);

    return (
        <>
            <div className="flex flex-col justify-center gap-4">
                <Stage width={width} height={height + textAreaHeight + textAreaMargin} onClick={select} onTouchStart={select}>
                    <Layer key="lighting-puzzle-board-layer" onTouchMove={(e) => e.evt.preventDefault()}>
                        <Rect
                            stroke="black"
                            strokeWidth={strokeWidth}
                            x={strokeWidthHalf - margin}
                            y={strokeWidthHalf - margin}
                            width={width - strokeWidth + margin * 2}
                            height={height - strokeWidth + margin * 2}
                        />
                    </Layer>
                    <Layer key="lighting-puzzle-piece-layer" listening={false}>
                        {coordinates.map((coordinate) => (
                            <Rect
                                fill={coordinate.color}
                                x={cellWidth * coordinate.x + strokeWidth + margin}
                                y={cellHeight * coordinate.y + strokeWidth + margin}
                                width={cellWidth - margin * 2}
                                height={cellHeight - margin * 2}
                            />
                        ))}
                    </Layer>
                    <Layer key="lighting-puzzle-text-layer" listening={false}>
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
                            text={oneStrokeWritingManager.result === Result.succeeded ? 'クリア！' : ''}
                            x={0}
                            y={height + textAreaMargin}
                            width={width}
                            height={textAreaHeight}
                            fill="#FF2200"
                            fontSize={small ? 22 : 32}
                            align="center"
                            verticalAlign="middle"
                        />
                    </Layer>
                </Stage>
                <div className="flex justify-center border-2 border-gray-600 bg-gray-300 py-3 sm:gap-12 sm:border-4 sm:py-4">
                    <FormControl sx={{ flexDirection: 'row', alignItems: 'center', gap: '1rem', minWidth: 100 }}>
                        <FormLabel id="radio-buttons-group-label" sx={{ fontWeight: 'bold', fontSize: small ? 16 : 20 }}>
                            サイズ
                        </FormLabel>
                        <Select
                            labelId="simple-select-label"
                            id="simple-select"
                            size={small ? 'small' : 'medium'}
                            sx={{ minWidth: 80, fontSize: small ? 18 : 20, textAlign: 'center' }}
                            value={size}
                            onChange={async (e) => {
                                if (!canClick) {
                                    return;
                                }

                                setSize(e.target.value as number);
                            }}
                        >
                            {[...Array(7)].map((_, i) => (
                                <MenuItem value={i + 4}>{i + 4}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="flex justify-center gap-4 sm:justify-end">
                    <Button
                        className="h-10 w-32 sm:h-12 sm:w-48"
                        fullWidth={false}
                        variant="contained"
                        color="success"
                        style={{ fontSize: small ? 18 : 24, fontWeight: small ? 'bold' : 'normal' }}
                        onClick={() => {
                            if (!canClick) {
                                return;
                            }

                            oneStrokeWritingManager.reset();
                            setCoordinates(() => convertCellsToCoordinates(oneStrokeWritingManager));
                        }}
                    >
                        リセット
                    </Button>
                    <Button
                        className="h-10 w-32 sm:h-12 sm:w-48"
                        fullWidth={false}
                        variant="contained"
                        color="success"
                        style={{ fontSize: small ? 18 : 24, fontWeight: small ? 'bold' : 'normal' }}
                        onClick={() => {
                            if (!canClick) {
                                return;
                            }

                            initialize();
                        }}
                    >
                        次の問題
                    </Button>
                </div>
            </div>
        </>
    );
};

function convertCellsToCoordinates(manager: OneStrokeWritingManager): Coordinate[] {
    const cells = manager.board.cells;
    const coordinates: Coordinate[] = [];
    for (let y = 0; y < cells.length; y++) {
        for (let x = 0; x < cells[y].length; x++) {
            let coordinate: Coordinate;

            if (manager.result === Result.succeeded || (manager.currentPosition?.x === x && manager.currentPosition?.y === y)) {
                coordinate = { x, y, color: '#00BB00' };
            } else if (cells[y][x] === OneStrokeWritingBoardCell.on) {
                coordinate = { x, y, color: '#CCCC00' };
            } else if (cells[y][x] === OneStrokeWritingBoardCell.off) {
                coordinate = { x, y, color: '#909090' };
            } else if (cells[y][x] === OneStrokeWritingBoardCell.block) {
                coordinate = { x, y, color: '#FF3333' };
            } else {
                coordinate = { x, y, color: '#909090' };
            }

            coordinates.push(coordinate);
        }
    }

    return coordinates;
}

export default OneStrokeWriting;
