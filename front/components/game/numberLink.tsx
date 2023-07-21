import { Button, FormControl, FormLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Ellipse, Layer, Rect, Stage, Text } from 'react-konva';
import { NumberLinkManager } from 'shared/game/numberLink/numberLinkManager';
import { Coordinate } from '../../shared/game/numberLink/coordinate';
import { getGameComponentSize } from '../../shared/utility/componentUtility';
import { KonvaEventObject } from 'konva/lib/Node';
import { Vector } from 'shared/game/numberLink/vector';

const NumberLink = (): JSX.Element => {
    const { width, height, small } = getGameComponentSize();

    const strokeWidth = small ? 10 : 20;
    const strokeWidthHalf = strokeWidth / 2;
    const margin = 2;
    const textAreaHeight = small ? 44 : 80;
    const textAreaMargin = 16;
    const textStrokeWidth = small ? 2 : 4;
    const textStrokeWidthHalf = textStrokeWidth / 2;

    const [size, setSize] = useState(5);
    const [cellWidth, setCellWidth] = useState((width - strokeWidth * 2) / size);
    const [cellHeight, setCellHeight] = useState((height - strokeWidth * 2) / size);
    const [numberLinkManager, setNumberLinkManager] = useState<NumberLinkManager>(new NumberLinkManager(size, size));
    const [coordinates, setCoordinates] = useState<Coordinate[]>(convertCellsToCoordinates(numberLinkManager));
    const [slidePosition, setSlidePosition] = useState<[number, number]>();
    const [mouseDown, setMouseDown] = useState(false);
    const [canClick, setCanClick] = useState(true);
    const [initial, setInitial] = useState(true);

    const [debug, setDebug] = useState('テスト');

    const displayDebug = (text: string) => {
        setDebug(text);
        setCoordinates(() => convertCellsToCoordinates(numberLinkManager));
    };

    const initialize = async () => {
        await numberLinkManager.initialize();
        setCoordinates(() => convertCellsToCoordinates(numberLinkManager));
    };

    const slide = async (e: KonvaEventObject<Event>): Promise<void> => {
        if (!canClick || numberLinkManager.isFinished) {
            return;
        }

        const [x, y] = convert(e);
        if (!slidePosition) {
            setSlidePosition([x, y]);

            return;
        }
        if (slidePosition[0] === x && slidePosition[1] === y) {
            return;
        }

        const direction = new Vector(x - slidePosition[0], y - slidePosition[1]);
        setSlidePosition([x, y]);
        if (numberLinkManager.next(slidePosition[0], slidePosition[1], direction)) {
            setCanClick(() => false);

            displayDebug(`通った`);

            setCoordinates(() => convertCellsToCoordinates(numberLinkManager));

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

    const slideEnd = (): void => {
        setSlidePosition(undefined);
    };

    useEffect(() => {
        if (initial) {
            return;
        }

        setNumberLinkManager(new NumberLinkManager(size, size));
    }, [size]);

    useEffect(() => {
        if (initial) {
            return;
        }

        initialize();
    }, [numberLinkManager]);

    useEffect(() => {
        setInitial(false);
        initialize();
    }, []);

    useLayoutEffect(() => {
        setCellWidth((width - strokeWidth * 2) / size);
        setCellHeight((height - strokeWidth * 2) / size);
        setCoordinates(() => convertCellsToCoordinates(numberLinkManager));
    }, [numberLinkManager, width, height]);

    return (
        <>
            <div className="flex flex-col justify-center gap-4">
                <Stage
                    width={width}
                    height={height + textAreaHeight + textAreaMargin}
                    onMouseDown={() => setMouseDown(true)}
                    onMouseUp={() => {
                        slideEnd();
                        setMouseDown(false);
                    }}
                    onMouseMove={async (e) => {
                        if (mouseDown) {
                            await slide(e);
                        }
                    }}
                >
                    <Layer key="number-link-board-layer" onTouchMove={(e) => e.evt.preventDefault()}>
                        <Rect
                            stroke="black"
                            strokeWidth={strokeWidth}
                            x={strokeWidthHalf - margin}
                            y={strokeWidthHalf - margin}
                            width={width - strokeWidth + margin * 2}
                            height={height - strokeWidth + margin * 2}
                        />
                    </Layer>
                    <Layer key="number-link-piece-layer" listening={false}>
                        {coordinates.map((coordinate) => {
                            if (coordinate.number) {
                                return (
                                    <Ellipse
                                        fill={coordinate.color}
                                        x={cellWidth * coordinate.x + cellWidth / 2 + strokeWidth}
                                        y={cellHeight * coordinate.y + cellHeight / 2 + strokeWidth}
                                        radiusX={cellWidth / 2.5}
                                        radiusY={cellHeight / 2.5}
                                    />
                                );
                            }
                        })}
                        {coordinates.map((coordinate) => (
                            <>
                                <Ellipse
                                    fill={coordinate.color}
                                    x={cellWidth * coordinate.x + cellWidth / 2 + strokeWidth}
                                    y={cellHeight * coordinate.y + cellHeight / 2 + strokeWidth}
                                    radiusX={cellWidth / 5.35}
                                    radiusY={cellHeight / 5.35}
                                />
                                {coordinate.routes.map((route) => {
                                    if (route.x === Vector.left.x && route.y === Vector.left.y) {
                                        return (
                                            <Rect
                                                fill={coordinate.color}
                                                x={cellWidth * coordinate.x + strokeWidth - margin}
                                                y={cellHeight * coordinate.y + cellHeight / 3 + strokeWidth - margin}
                                                width={cellWidth / 2 + margin * 2}
                                                height={cellHeight / 3 + margin * 2}
                                                cornerRadius={0}
                                            />
                                        );
                                    } else if (route.x === Vector.right.x && route.y === Vector.right.y) {
                                        return (
                                            <Rect
                                                fill={coordinate.color}
                                                x={cellWidth * coordinate.x + cellWidth / 2 + strokeWidth - margin}
                                                y={cellHeight * coordinate.y + cellHeight / 3 + strokeWidth - margin}
                                                width={cellWidth / 2 + margin * 2}
                                                height={cellHeight / 3 + margin * 2}
                                                cornerRadius={0}
                                            />
                                        );
                                    } else if (route.x === Vector.up.x && route.y === Vector.up.y) {
                                        return (
                                            <Rect
                                                fill={coordinate.color}
                                                x={cellWidth * coordinate.x + cellHeight / 3 + strokeWidth - margin}
                                                y={cellHeight * coordinate.y + strokeWidth - margin}
                                                width={cellWidth / 3 + margin * 2}
                                                height={cellHeight / 2 + margin * 2}
                                                cornerRadius={0}
                                            />
                                        );
                                    } else {
                                        return (
                                            <Rect
                                                fill={coordinate.color}
                                                x={cellWidth * coordinate.x + cellHeight / 3 + strokeWidth - margin}
                                                y={cellHeight * coordinate.y + cellHeight / 2 + strokeWidth - margin}
                                                width={cellWidth / 3 + margin * 2}
                                                height={cellHeight / 2 + margin * 2}
                                                cornerRadius={0}
                                            />
                                        );
                                    }
                                })}
                            </>
                        ))}
                        {coordinates
                            .filter((coordinate) => coordinate.number)
                            .map((coordinate) => (
                                <Text
                                    text={coordinate.number?.toString()}
                                    x={cellWidth * coordinate.x + strokeWidth + margin}
                                    y={cellHeight * coordinate.y + strokeWidth + margin}
                                    width={cellWidth - margin * 2}
                                    height={cellHeight - margin * 2}
                                    fill="white"
                                    fontSize={small ? 24 : 48}
                                    align="center"
                                    verticalAlign="middle"
                                />
                            ))}
                    </Layer>
                    <Layer key="number-link-text-layer" listening={false}>
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
                            text={numberLinkManager.isFinished ? 'クリア！' : ''}
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
                        color="secondary"
                        style={{ fontSize: small ? 18 : 24, fontWeight: small ? 'bold' : 'normal' }}
                        onClick={() => {
                            if (!canClick) {
                                return;
                            }

                            numberLinkManager.reset();
                            setCoordinates(() => convertCellsToCoordinates(numberLinkManager));
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

function convertCellsToCoordinates(manager: NumberLinkManager): Coordinate[] {
    const coordinates: Coordinate[] = [];
    const ids = new Set();

    const numberCells = manager.board.cells.flat().filter(x => x.number);
    for (const cell1 of numberCells) {
        if (!ids.has(cell1.id)) {
            coordinates.push({
                x: cell1.x,
                y: cell1.y,
                number: cell1.number,
                routes: cell1.routes,
                color: getColor(cell1.number)
            });
            ids.add(cell1.id);
        }

        const connectedCells = manager.getConnectedCells(cell1.x, cell1.y).flat();
        for (const cell2 of connectedCells) {
            if (!ids.has(cell2.id)) {
                coordinates.push({
                    x: cell2.x,
                    y: cell2.y,
                    number: cell2.number ? cell2.number : undefined,
                    routes: cell2.routes,
                    color: getColor(cell1.number)
                });
                ids.add(cell2.id);
            }
        }
    }

    const remainCells = manager.board.cells.flat().filter((x) => x.routes.length > 0 && !ids.has(x.id));
    for (const cell of remainCells) {
        coordinates.push({
            x: cell.x,
            y: cell.y,
            routes: cell.routes,
            color: getColor()
        });
        ids.add(cell.id);
    }

    return coordinates;
}

function getColor(index?: number): string {
    if (!index) {
        return '#AAAAAA';
    }

    switch (index % 7) {
        case 0:
            return '#BB0000';
        case 1:
            return '#DD0000';
        case 2:
            return '#00BB00';
        case 3:
            return '#00BBCC';
        default:
            return '#AAAAAA';
    }
}

export default NumberLink;
