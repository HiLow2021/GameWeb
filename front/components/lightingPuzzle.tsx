import { FormControl, FormLabel, Select, MenuItem, Button } from '@mui/material';
import { KonvaEventObject } from 'konva/lib/Node';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Stage, Layer, Text, Rect, FastLayer } from 'react-konva';
import { LightingPuzzleBoardCell } from 'shared/game/lightingPuzzle/enum/lightingPuzzleBoardCell';
import { LightingPuzzleManager } from 'shared/game/lightingPuzzle/lightingPuzzleManager';
import { Result } from 'shared/game/lightingPuzzle/enum/result';
import useSound from 'use-sound';
import SoundStateContext from '../contexts/soundStateContext';
import { Coordinate } from '../shared/game/lightingPuzzle/coordinate';
import { getGameComponentSize } from '../shared/utility/componentUtility';
import { CommonUtility } from 'shared/utility/commonUtility';

const LightingPuzzle = (): JSX.Element => {
    const { width, height, small } = getGameComponentSize();

    const strokeWidth = small ? 10 : 20;
    const strokeWidthHalf = strokeWidth / 2;
    const margin = 2;
    const textAreaHeight = small ? 44 : 80;
    const textAreaMargin = 16;
    const textStrokeWidth = small ? 2 : 4;
    const textStrokeWidthHalf = textStrokeWidth / 2;

    const [widthSize, setWidthSize] = useState(6);
    const [heightSize, setHeightSize] = useState(6);
    const [cellWidth, setCellWidth] = useState((width - strokeWidth * 2) / widthSize);
    const [cellHeight, setCellHeight] = useState((height - strokeWidth * 2) / heightSize);
    const [lightingPuzzleManager, setLightingPuzzleManager] = useState<LightingPuzzleManager>(
        new LightingPuzzleManager(widthSize, heightSize)
    );
    const [coordinates, setCoordinates] = useState<Coordinate[]>(convertCellsToCoordinates(lightingPuzzleManager));
    const [canClick, setCanClick] = useState(true);
    const [initial, setInitial] = useState(true);

    const { currentSoundState } = useContext(SoundStateContext);
    const [sound] = useSound('game/lightingPuzzle/sound.mp3');
    const startSound = () => {
        if (currentSoundState) {
            sound();
        }
    };

    const select = async (e: KonvaEventObject<Event>): Promise<void> => {
        if (!canClick) {
            return;
        }

        const [x, y] = convert(e);
        if (lightingPuzzleManager.next(x, y)) {
            setCanClick(() => false);

            setCoordinates(() => convertCellsToCoordinates(lightingPuzzleManager));
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
    const result = async () => {
        if (lightingPuzzleManager.result === Result.failed) {
            await CommonUtility.delay(200);

            lightingPuzzleManager.reset();
        }

        setCoordinates(() => convertCellsToCoordinates(lightingPuzzleManager));
    };

    useEffect(() => {
        if (initial) {
            setInitial(false);

            return;
        }

        setLightingPuzzleManager(new LightingPuzzleManager(widthSize, heightSize));
    }, [widthSize, heightSize]);

    useEffect(() => {
        result();
    }, [lightingPuzzleManager.result]);

    useLayoutEffect(() => {
        setCellWidth((width - strokeWidth * 2) / widthSize);
        setCellHeight((height - strokeWidth * 2) / heightSize);
        setCoordinates(() => convertCellsToCoordinates(lightingPuzzleManager));
    }, [lightingPuzzleManager, width, height]);

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
                    <FastLayer key="lighting-puzzle-piece-layer">
                        {coordinates.map((coordinate) => (
                            <Rect
                                fill={coordinate.color}
                                x={cellWidth * coordinate.x + strokeWidth + margin}
                                y={cellHeight * coordinate.y + strokeWidth + margin}
                                width={cellWidth - margin * 2}
                                height={cellHeight - margin * 2}
                            />
                        ))}
                    </FastLayer>
                    <FastLayer key="lighting-puzzle-text-layer">
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
                            text={lightingPuzzleManager.result === Result.succeeded ? 'クリア！' : ''}
                            x={0}
                            y={height + textAreaMargin}
                            width={width}
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
                                <MenuItem value={i + 3}>{i + 3}</MenuItem>
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
                                <MenuItem value={i + 3}>{i + 3}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="flex justify-center sm:justify-end">
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

                            lightingPuzzleManager.initialize();
                            setCoordinates(() => convertCellsToCoordinates(lightingPuzzleManager));
                        }}
                    >
                        リセット
                    </Button>
                </div>
            </div>
        </>
    );
};

function convertCellsToCoordinates(manager: LightingPuzzleManager): Coordinate[] {
    const cells = manager.board.cells;
    const coordinates: Coordinate[] = [];
    for (let y = 0; y < cells.length; y++) {
        for (let x = 0; x < cells[y].length; x++) {
            let coordinate: Coordinate;

            if (manager.result === Result.succeeded || (manager.currentPosition?.x === x && manager.currentPosition?.y === y)) {
                coordinate = { x, y, color: '#00BB00' };
            } else if (cells[y][x] === LightingPuzzleBoardCell.on) {
                coordinate = { x, y, color: '#CCCC00' };
            } else if (cells[y][x] === LightingPuzzleBoardCell.off) {
                coordinate = { x, y, color: '#909090' };
            } else if (cells[y][x] === LightingPuzzleBoardCell.block) {
                coordinate = { x, y, color: '#FF3333' };
            } else {
                coordinate = { x, y, color: '#CCCC00' };
            }

            coordinates.push(coordinate);
        }
    }

    return coordinates;
}

export default LightingPuzzle;
