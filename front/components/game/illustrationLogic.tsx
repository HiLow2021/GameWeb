import { Button, FormControl, FormLabel, MenuItem, Select } from '@mui/material';
import { KonvaEventObject } from 'konva/lib/Node';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Group, Layer, Rect, Stage, Text } from 'react-konva';
import { IllustrationLogicBoardCell } from 'shared/game/illustrationLogic/enums/illustrationLogicBoardCell';
import { IllustrationLogicManager } from 'shared/game/illustrationLogic/illustrationLogicManager';
import { Coordinate } from '../../shared/game/illustrationLogic/coordinate';
import { Level } from '../../shared/game/illustrationLogic/level';
import { getGameComponentSize } from '../../shared/utility/componentUtility';
import { useContextSound } from '../../shared/utility/soundUtility';

const IllustrationLogic = (): JSX.Element => {
    const { width, height, small } = getGameComponentSize();

    const strokeWidth = small ? 2 : 4;
    const strokeWidthHalf = strokeWidth / 2;
    const margin = 4;
    const textAreaHeight = small ? 44 : 80;
    const textAreaMargin = 16;
    const textStrokeWidth = small ? 2 : 4;
    const textStrokeWidthHalf = textStrokeWidth / 2;

    const mainGroup = { width: width / 1.33, height: height / 1.33 };
    const descriptionGroup = { width: width / 4, height: height / 4 };
    const hintHorizontalGroup = { width: width / 4, height: height / 1.33 };
    const hintVerticalGroup = { width: width / 1.33, height: height / 4 };

    const [size, setSize] = useState(10);
    const [cellMainWidth, setCellMainWidth] = useState((mainGroup.width - margin) / size);
    const [cellMainHeight, setCellMainHeight] = useState((mainGroup.height - margin) / size);
    const [cellHintHorizontalWidth, setCellHintHorizontalWidth] = useState((hintHorizontalGroup.width - margin) / size / 2);
    const [cellHintHorizontalHeight, setCellHintHorizontalHeight] = useState((hintHorizontalGroup.height - margin) / size);
    const [cellHintVerticalWidth, setCellHintVerticalWidth] = useState((hintVerticalGroup.width - margin) / size);
    const [cellHintVerticalHeight, setCellHintVerticalHeight] = useState((hintVerticalGroup.height - margin) / size / 2);

    const [illustrationLogicManager, setIllustrationLogicManager] = useState<IllustrationLogicManager>(
        new IllustrationLogicManager(size, size)
    );
    const [coordinates, setCoordinates] = useState<Coordinate[]>(convertCellsToCoordinates(illustrationLogicManager));
    const [canClick, setCanClick] = useState(true);
    const [initial, setInitial] = useState(true);
    const [level, setLevel] = useState<Level>(Level.normal);

    const startSound = useContextSound('game/illustrationLogic/sound.mp3');

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
            startSound();

            setCanClick(() => true);
        }

        function convert(e: KonvaEventObject<Event>): number[] {
            const stage = e.target.getStage();
            const position = stage?.getPointerPosition();
            if (!position) {
                return [-1, -1];
            }

            const x = Math.floor((position.x - strokeWidth - hintHorizontalGroup.width) / cellMainWidth);
            const y = Math.floor((position.y - strokeWidth - hintVerticalGroup.height) / cellMainHeight);

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
        setCellMainWidth((mainGroup.width - margin) / size);
        setCellMainHeight((mainGroup.height - margin) / size);
        setCellHintHorizontalWidth((hintHorizontalGroup.width - margin) / size);
        setCellHintHorizontalHeight((hintHorizontalGroup.height - margin) / size);
        setCellHintVerticalWidth((hintVerticalGroup.width - margin) / size);
        setCellHintVerticalHeight((hintVerticalGroup.height - margin) / size);
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
                    <Layer key="illustration-logic-board-layer">
                        <Group
                            key="illustration-logic-description-group"
                            x={strokeWidth}
                            y={strokeWidth}
                            width={descriptionGroup.width}
                            height={descriptionGroup.height}
                        >
                            <Rect fill="black" x={0} y={0} width={descriptionGroup.width} height={descriptionGroup.height} />
                        </Group>
                        <Group
                            key="illustration-logic-hint-horizontal-group"
                            x={strokeWidth}
                            y={descriptionGroup.height}
                            width={hintHorizontalGroup.width}
                            height={hintHorizontalGroup.height}
                        >
                            <Rect fill="white" x={0} y={0} width={hintHorizontalGroup.width} height={hintHorizontalGroup.height} />
                            {convertHintsToStrings(illustrationLogicManager)[0].map((hint, i) => (
                                <Text
                                    text={hint}
                                    x={0}
                                    y={cellHintHorizontalHeight * i}
                                    width={hintHorizontalGroup.width}
                                    height={cellHintHorizontalHeight}
                                    offsetX={12}
                                    offsetY={-4}
                                    fill="black"
                                    fontSize={small ? 15 : 28}
                                    align="right"
                                    verticalAlign="middle"
                                />
                            ))}
                        </Group>
                        <Group
                            key="illustration-logic-hint-vertical-group"
                            x={descriptionGroup.width}
                            y={strokeWidth}
                            width={hintVerticalGroup.width}
                            height={hintVerticalGroup.height}
                        >
                            <Rect fill="white" x={0} y={0} width={hintVerticalGroup.width} height={hintVerticalGroup.height} />
                            {convertHintsToStrings(illustrationLogicManager)[1].map((hint, i) => (
                                <Text
                                    text={hint}
                                    x={cellHintVerticalWidth * i}
                                    y={0}
                                    width={cellHintVerticalWidth - margin * 2}
                                    height={hintVerticalGroup.height}
                                    offsetX={-cellHintVerticalWidth / 2.75}
                                    offsetY={4}
                                    fill="black"
                                    fontSize={small ? 15 : 28}
                                    align="middle"
                                    verticalAlign="bottom"
                                />
                            ))}
                        </Group>
                        <Group
                            key="illustration-logic-main-group"
                            x={hintHorizontalGroup.width}
                            y={hintVerticalGroup.height}
                            width={mainGroup.width}
                            height={mainGroup.height}
                            onTouchMove={(e) => e.evt.preventDefault()}
                        >
                            <Rect fill="white" x={0} y={0} width={mainGroup.width} height={mainGroup.height} />
                            {coordinates.map((coordinate) => (
                                <Rect
                                    fill={coordinate.color}
                                    x={cellMainWidth * coordinate.x + margin}
                                    y={cellMainHeight * coordinate.y + margin}
                                    width={cellMainWidth - margin}
                                    height={cellMainHeight - margin}
                                />
                            ))}
                        </Group>
                        <Rect
                            stroke="black"
                            strokeWidth={strokeWidth}
                            x={strokeWidthHalf}
                            y={strokeWidthHalf}
                            width={width}
                            height={height}
                        />
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

    for (let y = 0; y < manager.board.height; y++) {
        for (let x = 0; x < manager.board.width; x++) {
            const cell = manager.board.get(x, y);
            if (cell) {
                coordinates.push({
                    x,
                    y,
                    color: cell === IllustrationLogicBoardCell.on ? '#CCCC00' : '#909090'
                });
            }
        }
    }

    return coordinates;
}

function convertHintsToStrings(manager: IllustrationLogicManager): [string[], string[]] {
    const [rows, columns] = manager.hint;
    const separator = ' ';
    const rowHints = rows.map((x) => x.join(separator));
    const columnHints = columns.map((x) => x.join(separator));

    return [rowHints, columnHints];
}

export default IllustrationLogic;
