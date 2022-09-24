import { Button, FormControl, FormLabel, MenuItem, Select } from '@mui/material';
import { KonvaEventObject } from 'konva/lib/Node';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { FastLayer, Group, Layer, Rect, Stage, Text } from 'react-konva';
import { SlidingPuzzleManager } from 'shared/game/slidingPuzzle/slidingPuzzleManager';
import useSound from 'use-sound';
import SoundStateContext from '../contexts/soundStateContext';
import { Coordinate } from '../shared/game/slidingPuzzle/coordinate';
import { getGameComponentSize } from '../shared/utility/componentUtility';

const SlidingPuzzle = (): JSX.Element => {
    const { width, height, small } = getGameComponentSize();

    const outerStrokeWidth = small ? 10 : 20;
    const outerStrokeWidthHalf = outerStrokeWidth / 2;
    const innerStrokeWidth = small ? 1 : 2;
    const innerStrokeWidthHalf = innerStrokeWidth / 2;
    const textAreaHeight = small ? 44 : 80;
    const textAreaMargin = 16;
    const textStrokeWidth = small ? 2 : 4;
    const textStrokeWidthHalf = textStrokeWidth / 2;

    const [widthSize, setWidthSize] = useState(4);
    const [heightSize, setHeightSize] = useState(4);
    const [cellWidth, setCellWidth] = useState((width - outerStrokeWidth * 2) / widthSize);
    const [cellHeight, setCellHeight] = useState((height - outerStrokeWidth * 2) / heightSize);
    const [slidingPuzzleManager, setSlidingPuzzleManager] = useState<SlidingPuzzleManager>(new SlidingPuzzleManager(widthSize, heightSize));
    const [coordinates, setCoordinates] = useState<Coordinate[]>(convertCellsToCoordinates(slidingPuzzleManager.board.cells));
    const [canClick, setCanClick] = useState(true);
    const [initial, setInitial] = useState(true);

    const { currentSoundState } = useContext(SoundStateContext);
    const [sound] = useSound('game/slidingPuzzle/sound.mp3');
    const startSound = () => {
        if (currentSoundState) {
            sound();
        }
    };

    const select = async (e: KonvaEventObject<Event>): Promise<void> => {
        if (!canClick || slidingPuzzleManager.isSorted) {
            return;
        }

        const [x, y] = convert(e);
        if (slidingPuzzleManager.slide(x, y)) {
            setCanClick(() => false);

            setCoordinates(() => convertCellsToCoordinates(slidingPuzzleManager.board.cells));
            startSound();

            setCanClick(() => true);
        }

        function convert(e: KonvaEventObject<Event>): number[] {
            const stage = e.target.getStage();
            const position = stage?.getPointerPosition();
            if (!position) {
                return [-1, -1];
            }

            const x = Math.floor((position.x - outerStrokeWidth) / cellWidth);
            const y = Math.floor((position.y - outerStrokeWidth) / cellHeight);

            return [x, y];
        }
    };

    useEffect(() => {
        if (initial) {
            setInitial(false);

            return;
        }

        setSlidingPuzzleManager(new SlidingPuzzleManager(widthSize, heightSize));
    }, [widthSize, heightSize]);

    useLayoutEffect(() => {
        setCellWidth((width - outerStrokeWidth * 2) / widthSize);
        setCellHeight((height - outerStrokeWidth * 2) / heightSize);
        setCoordinates(() => convertCellsToCoordinates(slidingPuzzleManager.board.cells));
    }, [slidingPuzzleManager, width, height]);

    return (
        <>
            <div className="flex flex-col justify-center gap-4">
                <Stage width={width} height={height + textAreaHeight + textAreaMargin} onClick={select} onTouchStart={select}>
                    <Layer key="sliding-puzzle-board-layer" onTouchMove={(e) => e.evt.preventDefault()}>
                        <Rect
                            stroke="black"
                            strokeWidth={outerStrokeWidth}
                            x={outerStrokeWidthHalf}
                            y={outerStrokeWidthHalf}
                            width={width - outerStrokeWidth}
                            height={height - outerStrokeWidth}
                        />
                    </Layer>
                    <FastLayer key="sliding-puzzle-piece-layer">
                        {coordinates.map((coordinate) =>
                            coordinate.number !== slidingPuzzleManager.missingNumber ? (
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
                                        fontSize={small ? 20 : 32}
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
                            fontSize={small ? 22 : 32}
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
                            fontSize={small ? 22 : 32}
                            align="center"
                            verticalAlign="middle"
                        />
                    </FastLayer>
                </Stage>
                <div className="flex justify-center border-2 border-gray-600 bg-gray-300 pt-2 pb-3 sm:gap-12 sm:border-4 sm:py-4">
                    <FormControl sx={{ flexDirection: small ? 'column' : 'row', alignItems: 'center', gap: '1rem', minWidth: 100 }}>
                        <FormLabel id="radio-buttons-group-label" sx={{ fontWeight: 'bold', fontSize: small ? 16 : 20 }}>
                            横サイズ
                        </FormLabel>
                        <Select
                            labelId="simple-select-label"
                            id="simple-select"
                            size={small ? 'small' : 'medium'}
                            sx={{ minWidth: 80, fontSize: small ? 18 : 20, textAlign: 'center' }}
                            value={widthSize}
                            onChange={async (e) => {
                                if (!canClick) {
                                    return;
                                }

                                setWidthSize(e.target.value as number);
                            }}
                        >
                            {[...Array(7)].map((_, i) => (
                                <MenuItem value={i + 4}>{i + 4}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ flexDirection: small ? 'column' : 'row', alignItems: 'center', gap: '1rem', minWidth: 100 }}>
                        <FormLabel id="radio-buttons-group-label" sx={{ fontWeight: 'bold', fontSize: small ? 16 : 20 }}>
                            縦サイズ
                        </FormLabel>
                        <Select
                            labelId="simple-select-label"
                            id="simple-select"
                            size={small ? 'small' : 'medium'}
                            sx={{ minWidth: 80, fontSize: small ? 18 : 20, textAlign: 'center' }}
                            value={heightSize}
                            onChange={async (e) => {
                                if (!canClick) {
                                    return;
                                }

                                setHeightSize(e.target.value as number);
                            }}
                        >
                            {[...Array(7)].map((_, i) => (
                                <MenuItem value={i + 4}>{i + 4}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="flex justify-center sm:justify-end">
                    <Button
                        className="h-10 w-32 sm:h-12 sm:w-48"
                        fullWidth={false}
                        variant="contained"
                        color="primary"
                        style={{ fontSize: small ? 18 : 24, fontWeight: small ? 'bold' : 'normal' }}
                        onClick={() => {
                            if (!canClick) {
                                return;
                            }

                            slidingPuzzleManager.initialize();
                            setCoordinates(() => convertCellsToCoordinates(slidingPuzzleManager.board.cells));
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
            coordinates.push({ x, y, number: cells[y][x], correct: y * cells[y].length + x === cells[y][x] });
        }
    }

    return coordinates;
}

export default SlidingPuzzle;
