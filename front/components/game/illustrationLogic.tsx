import { Button, FormControl, FormLabel, MenuItem, Select } from '@mui/material';
import { KonvaEventObject } from 'konva/lib/Node';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Layer, Rect, Stage, Text } from 'react-konva';
import { IllustrationLogicManager } from 'shared/game/illustrationLogic/illustrationLogicManager';
import { Coordinate } from '../../shared/game/illustrationLogic/coordinate';
import { Level } from '../../shared/game/illustrationLogic/level';
import { getGameComponentSize } from '../../shared/utility/componentUtility';

const IllustrationLogic = (): JSX.Element => {
    const { width, height, small } = getGameComponentSize();

    const strokeWidth = small ? 2 : 4;
    const strokeWidthHalf = strokeWidth / 2;
    const margin = 2;
    const textAreaHeight = small ? 44 : 80;
    const textAreaMargin = 16;
    const textStrokeWidth = small ? 2 : 4;
    const textStrokeWidthHalf = textStrokeWidth / 2;

    const [size, setSize] = useState(5);
    const [cellWidth, setCellWidth] = useState(width / size);
    const [cellHeight, setCellHeight] = useState(height / size);
    const [illustrationLogicManager, setIllustrationLogicManager] = useState<IllustrationLogicManager>(
        new IllustrationLogicManager(size, size)
    );
    const [coordinates, setCoordinates] = useState<Coordinate[]>(convertCellsToCoordinates(illustrationLogicManager));
    const [canClick, setCanClick] = useState(true);
    const [initial, setInitial] = useState(true);
    const [level, setLevel] = useState<Level>(Level.normal);

    const initialize = async () => {
        await illustrationLogicManager.initialize();
        setCoordinates(() => convertCellsToCoordinates(illustrationLogicManager));
    };

    const select = async (e: KonvaEventObject<Event>): Promise<void> => {
        if (!canClick || illustrationLogicManager.isFinished) {
            return;
        }

        const [x, y] = convert(e);
        if (illustrationLogicManager.next(x, y)) {
            setCanClick(() => false);

            setCoordinates(() => convertCellsToCoordinates(illustrationLogicManager));

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

    useEffect(() => {
        if (initial) {
            return;
        }

        setIllustrationLogicManager(new IllustrationLogicManager(size, size));
    }, [size]);

    useEffect(() => {
        if (initial) {
            return;
        }

        initialize();
    }, [illustrationLogicManager]);

    useEffect(() => {
        setInitial(false);
        initialize();
    }, []);

    useLayoutEffect(() => {
        setCellWidth((width - strokeWidth * 2) / size);
        setCellHeight((height - strokeWidth * 2) / size);
        setCoordinates(() => convertCellsToCoordinates(illustrationLogicManager));
    }, [illustrationLogicManager, width, height]);

    return (
        <>
            <div className="flex flex-col justify-center gap-4">
                <Stage
                    width={width + strokeWidth}
                    height={height + strokeWidth + textAreaHeight + textAreaMargin}
                    onClick={select}
                    onTouchStart={select}
                >
                    <Layer key="illustration-logic-board-layer" onTouchMove={(e) => e.evt.preventDefault()}>
                        <Rect
                            stroke="black"
                            strokeWidth={strokeWidth}
                            x={strokeWidthHalf}
                            y={strokeWidthHalf}
                            width={width}
                            height={height}
                        />
                    </Layer>
                    <Layer key="illustration-logic-piece-layer" listening={false}>
                        {coordinates.map((coordinate) => (
                            <Rect
                                fill={'#BBBBBB'}
                                x={cellWidth * coordinate.x + strokeWidth + margin * 2}
                                y={cellHeight * coordinate.y + strokeWidth + margin * 2}
                                width={cellWidth - margin * 2}
                                height={cellHeight - margin * 2}
                            />
                        ))}
                    </Layer>
                    <Layer key="illustration-logic-text-layer" listening={false}>
                        <Rect fill="#DDDDDD" x={0} y={height + textAreaMargin} width={width} height={textAreaHeight} />
                        <Rect
                            stroke="black"
                            strokeWidth={textStrokeWidth}
                            x={textStrokeWidthHalf}
                            y={height + textAreaMargin + textStrokeWidthHalf}
                            width={width}
                            height={textAreaHeight - textStrokeWidth}
                        />
                        <Text
                            text={illustrationLogicManager.isFinished ? 'クリア！' : ''}
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
                    <FormControl sx={{ flexDirection: small ? 'column' : 'row', alignItems: 'center', gap: '1rem', minWidth: 180 }}>
                        <FormLabel id="radio-buttons-group-label" sx={{ fontWeight: 'bold', fontSize: small ? 16 : 20 }}>
                            難易度
                        </FormLabel>
                        <Select
                            labelId="simple-select-label"
                            id="simple-select"
                            value={level}
                            sx={{ fontSize: small ? 14 : 16 }}
                            onChange={async (e) => {
                                if (!canClick) {
                                    return;
                                }

                                setLevel(e.target.value as Level);
                            }}
                        >
                            <MenuItem value={'normal'}>普通</MenuItem>
                            <MenuItem value={'hard'}>難しい</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="flex justify-center gap-4 sm:justify-end">
                    <Button
                        className="h-10 w-32 sm:h-12 sm:w-48"
                        fullWidth={false}
                        variant="contained"
                        color="secondary"
                        style={{ fontSize: small ? 18 : 24, fontWeight: small ? 'bold' : 'normal' }}
                        onClick={() => {
                            if (!canClick) {
                                return;
                            }

                            illustrationLogicManager.reset();
                            setCoordinates(() => convertCellsToCoordinates(illustrationLogicManager));
                        }}
                    >
                        リセット
                    </Button>
                    <Button
                        className="h-10 w-32 sm:h-12 sm:w-48"
                        fullWidth={false}
                        variant="contained"
                        color="secondary"
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

function convertCellsToCoordinates(manager: IllustrationLogicManager): Coordinate[] {
    const coordinates: Coordinate[] = [];

    for (let y = 0; y < 5; y++) {
        for (let x = 0; x < 5; x++) {
            coordinates.push({
                x,
                y
            });
        }
    }

    return coordinates;
}

export default IllustrationLogic;
