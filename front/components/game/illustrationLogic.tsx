import { Button, FormControl, FormLabel, MenuItem, Select } from '@mui/material';
import { KonvaEventObject } from 'konva/lib/Node';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Group, Layer, Line, Rect, Stage, Text } from 'react-konva';
import { IllustrationLogicBoardCell } from 'shared/game/illustrationLogic/enums/illustrationLogicBoardCell';
import { IllustrationLogicManager } from 'shared/game/illustrationLogic/illustrationLogicManager';
import { Coordinate } from '../../shared/game/illustrationLogic/coordinate';
import { Level, toLogicValue } from '../../shared/game/illustrationLogic/level';
import { getGameComponentSize } from '../../shared/utility/componentUtility';
import { useContextSound } from '../../shared/utility/soundUtility';

const IllustrationLogic = (): JSX.Element => {
    const { width, height, small } = getGameComponentSize();

    const strokeWidth = small ? 2 : 4;
    const strokeWidthHalf = strokeWidth / 2;
    const miniStrokeWidth = strokeWidth * 1.5;
    const margin = small ? 2 : 4;
    const miniMargin = margin * 12;
    const intervalLine = 5;
    const textAreaHeight = small ? 44 : 80;
    const textAreaMargin = 16;
    const textStrokeWidth = small ? 2 : 4;
    const textStrokeWidthHalf = textStrokeWidth / 2;

    const mainGroup = { width: width / 1.33, height: height / 1.33 };
    const miniGroup = { width: width / 4, height: height / 4 };
    const hintHorizontalGroup = { width: width / 4, height: height / 1.33 };
    const hintVerticalGroup = { width: width / 1.33, height: height / 4 };
    const hintHorizontalOffset = { x: small ? 8 : 16, y: small ? -2 : -2 };
    const hintVerticalOffset = { x: small ? 0 : 0, y: small ? 6 : 8 };

    const [size, setSize] = useState(10);
    const [cellMainWidth, setCellMainWidth] = useState((mainGroup.width - margin) / size);
    const [cellMainHeight, setCellMainHeight] = useState((mainGroup.height - margin) / size);
    const [cellMiniWidth, setCellMiniWidth] = useState((miniGroup.width - miniMargin) / size);
    const [cellMiniHeight, setCellMiniHeight] = useState((miniGroup.height - miniMargin) / size);
    const [cellHintHorizontalHeight, setCellHintHorizontalHeight] = useState((hintHorizontalGroup.height - margin) / size);
    const [cellHintVerticalWidth, setCellHintVerticalWidth] = useState((hintVerticalGroup.width - margin) / size);

    const [illustrationLogicManager, setIllustrationLogicManager] = useState<IllustrationLogicManager>(
        new IllustrationLogicManager(size, size)
    );
    const [coordinates, setCoordinates] = useState<Coordinate[]>(convertCellsToCoordinates(illustrationLogicManager));
    const [hints, setHints] = useState<[string[], string[]]>(convertHintsToStrings(illustrationLogicManager));
    const [canClick, setCanClick] = useState(true);
    const [initial, setInitial] = useState(true);
    const [level, setLevel] = useState<Level>(Level.normal);

    const startSound = useContextSound('game/illustrationLogic/sound.mp3');

    const initialize = async () => {
        await illustrationLogicManager.initialize();
        setCoordinates(() => convertCellsToCoordinates(illustrationLogicManager));
        setHints(() => convertHintsToStrings(illustrationLogicManager));
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
        setCellMiniWidth((miniGroup.width - miniMargin) / size);
        setCellMiniHeight((miniGroup.height - miniMargin) / size);
        setCellHintHorizontalHeight((hintHorizontalGroup.height - margin) / size);
        setCellHintVerticalWidth((hintVerticalGroup.width - margin) / size);
        setCoordinates(() => convertCellsToCoordinates(illustrationLogicManager));
        setHints(() => convertHintsToStrings(illustrationLogicManager));
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
                            key="illustration-logic-mini-group"
                            x={strokeWidth}
                            y={strokeWidth}
                            width={miniGroup.width}
                            height={miniGroup.height}
                        >
                            <Rect fill="#00000090" x={0} y={0} width={miniGroup.width - margin} height={miniGroup.height - margin} />
                            {coordinates.map((coordinate) => (
                                <Rect
                                    fill={coordinate.miniColor}
                                    x={cellMiniWidth * coordinate.x + miniMargin / 2.25}
                                    y={cellMiniHeight * coordinate.y + miniMargin / 2.25}
                                    width={cellMiniWidth + 1}
                                    height={cellMiniHeight + 1}
                                />
                            ))}
                        </Group>
                        <Group
                            key="illustration-logic-hint-horizontal-group"
                            x={strokeWidth}
                            y={miniGroup.height}
                            width={hintHorizontalGroup.width}
                            height={hintHorizontalGroup.height}
                        >
                            {hints[0].map((hint, i) => (
                                <>
                                    <Rect
                                        fill={i % 2 === 0 ? '#00000020' : '#00000040'}
                                        x={0}
                                        y={cellHintHorizontalHeight * i}
                                        width={hintHorizontalGroup.width}
                                        height={cellHintHorizontalHeight + (i === hints[0].length - 1 ? margin : 0)}
                                    />
                                    <Text
                                        text={hint}
                                        x={0}
                                        y={cellHintHorizontalHeight * i}
                                        width={hintHorizontalGroup.width}
                                        height={cellHintHorizontalHeight}
                                        offsetX={hintHorizontalOffset.x}
                                        offsetY={hintHorizontalOffset.y}
                                        fill="#0070FF"
                                        fontSize={small ? 14 : 26}
                                        fontFamily="Meiryo"
                                        align="right"
                                        verticalAlign="middle"
                                    />
                                </>
                            ))}
                        </Group>
                        <Group
                            key="illustration-logic-hint-vertical-group"
                            x={miniGroup.width}
                            y={strokeWidth}
                            width={hintVerticalGroup.width}
                            height={hintVerticalGroup.height}
                        >
                            {hints[1].map((hint, i) => (
                                <>
                                    <Rect
                                        fill={i % 2 === 0 ? '#00000020' : '#00000040'}
                                        x={cellHintVerticalWidth * i}
                                        y={0}
                                        width={cellHintVerticalWidth + (i === hints[1].length - 1 ? margin : 0)}
                                        height={hintVerticalGroup.height}
                                    />
                                    <Text
                                        text={hint}
                                        x={cellHintVerticalWidth * i}
                                        y={0}
                                        width={cellHintVerticalWidth}
                                        height={hintVerticalGroup.height}
                                        offsetX={hintVerticalOffset.x}
                                        offsetY={hintVerticalOffset.y}
                                        fill="#0070FF"
                                        fontSize={small ? 14 : 26}
                                        fontFamily="Meiryo"
                                        align="center"
                                        verticalAlign="bottom"
                                    />
                                </>
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
                            <Rect fill="#707070" x={0} y={0} width={mainGroup.width} height={mainGroup.height} cornerRadius={4} />
                            {Array.from({ length: size / intervalLine - 1 }).map((_, i) => (
                                <>
                                    <Line
                                        stroke="#0070FF"
                                        strokeWidth={strokeWidth * 2}
                                        points={[
                                            cellMainWidth * (i + 1) * intervalLine + strokeWidthHalf,
                                            0,
                                            cellMainWidth * (i + 1) * intervalLine + strokeWidthHalf,
                                            mainGroup.height
                                        ]}
                                    />
                                    <Line
                                        stroke="#0070FF"
                                        strokeWidth={strokeWidth * 2}
                                        points={[
                                            0,
                                            cellMainHeight * (i + 1) * intervalLine + strokeWidthHalf,
                                            mainGroup.width,
                                            cellMainHeight * (i + 1) * intervalLine + strokeWidthHalf
                                        ]}
                                    />
                                </>
                            ))}
                            {coordinates.map((coordinate) => (
                                <>
                                    <Rect
                                        fill={coordinate.color}
                                        x={cellMainWidth * coordinate.x + margin}
                                        y={cellMainHeight * coordinate.y + margin}
                                        width={cellMainWidth - margin}
                                        height={cellMainHeight - margin}
                                        cornerRadius={4}
                                    />
                                    <Rect
                                        fill={coordinate.color}
                                        x={cellMainWidth * coordinate.x + margin}
                                        y={cellMainHeight * coordinate.y + margin}
                                        width={cellMainWidth - margin}
                                        height={cellMainHeight - margin}
                                        cornerRadius={4}
                                    />
                                    <Line
                                        stroke={coordinate.markColor}
                                        strokeWidth={miniStrokeWidth}
                                        points={[
                                            cellMainWidth * coordinate.x + margin * 3 + 1,
                                            cellMainHeight * coordinate.y + margin * 3 + 1,
                                            cellMainWidth * (coordinate.x + 1) - margin * 2.5 + 1,
                                            cellMainHeight * (coordinate.y + 1) - margin * 2.5 + 1
                                        ]}
                                    />
                                    <Line
                                        stroke={coordinate.markColor}
                                        strokeWidth={miniStrokeWidth}
                                        points={[
                                            cellMainWidth * coordinate.x + margin * 3 + 1,
                                            cellMainHeight * (coordinate.y + 1) - margin * 2.5 + 1,
                                            cellMainWidth * (coordinate.x + 1) - margin * 2.5 + 1,
                                            cellMainHeight * coordinate.y + margin * 3 + 1
                                        ]}
                                    />
                                </>
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
                            text={illustrationLogicManager.isFinished ? `答えは 「${illustrationLogicManager.title}」` : ''}
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
                    <FormControl sx={{ flexDirection: 'row', alignItems: 'center', gap: '1rem', minWidth: 180 }}>
                        <FormLabel id="radio-buttons-group-label" sx={{ fontWeight: 'bold', fontSize: small ? 16 : 20 }}>
                            難易度
                        </FormLabel>
                        <Select
                            labelId="simple-select-label"
                            id="simple-select"
                            value={level}
                            sx={{ fontSize: small ? 14 : 16 }}
                            onChange={(e) => {
                                if (!canClick) {
                                    return;
                                }

                                setLevel(e.target.value as Level);
                                setSize(toLogicValue(e.target.value as Level));
                            }}
                        >
                            <MenuItem value={Level.normal}>普通</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="flex justify-center gap-4 sm:justify-end">
                    <Button
                        className="h-10 w-32 sm:h-12 sm:w-48"
                        fullWidth={false}
                        variant="contained"
                        color="info"
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
                        color="info"
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
            const even = (x + y) % 2 === 0;
            coordinates.push({
                x,
                y,
                color: cell === IllustrationLogicBoardCell.On ? '#00CFFF' : even ? '#CCCCCC' : '#DDDDDD',
                miniColor: cell === IllustrationLogicBoardCell.On ? '#FFFFFF' : 'transparent',
                markColor: cell === IllustrationLogicBoardCell.Mark ? '#FF7F50' : 'transparent'
            });
        }
    }

    return coordinates;
}

function convertHintsToStrings(manager: IllustrationLogicManager): [string[], string[]] {
    const [rows, columns] = manager.hint;
    const rowHints = rows.map((x) => x.join(' '));
    const columnHints = columns.map((x) => x.join('    '));

    return [rowHints, columnHints];
}

export default IllustrationLogic;
