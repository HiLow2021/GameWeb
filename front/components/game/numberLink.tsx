import { Button, FormControl, FormLabel, MenuItem, Select } from '@mui/material';
import { KonvaEventObject } from 'konva/lib/Node';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Ellipse, Layer, Rect, Stage, Text } from 'react-konva';
import { NumberLinkManager } from 'shared/game/numberLink/numberLinkManager';
import { Vector } from 'shared/game/numberLink/vector';
import { Coordinate } from '../../shared/game/numberLink/coordinate';
import { getGameComponentSize } from '../../shared/utility/componentUtility';

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

    const initialize = async () => {
        await numberLinkManager.initialize();
        setCoordinates(() => convertCellsToCoordinates(numberLinkManager));
    };

    const slide = (e: KonvaEventObject<Event>): void => {
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

        if (numberLinkManager.next(slidePosition[0], slidePosition[1], new Vector(x - slidePosition[0], y - slidePosition[1]))) {
            setCanClick(() => false);

            setCoordinates(() => convertCellsToCoordinates(numberLinkManager));

            setCanClick(() => true);
        }

        setSlidePosition([x, y]);
    };

    const slideEnd = (): void => {
        setSlidePosition(undefined);
    };

    const clear = (e: KonvaEventObject<Event>): void => {
        if (!canClick || numberLinkManager.isFinished) {
            return;
        }

        const [x, y] = convert(e);
        if (numberLinkManager.clearConnectedCells(x, y)) {
            setCanClick(() => false);

            setCoordinates(() => convertCellsToCoordinates(numberLinkManager));

            setCanClick(() => true);
        }
    };

    const convert = (e: KonvaEventObject<Event>): number[] => {
        const stage = e.target.getStage();
        const position = stage?.getPointerPosition();
        if (!position) {
            return [-1, -1];
        }

        const x = Math.floor((position.x - strokeWidth) / cellWidth);
        const y = Math.floor((position.y - strokeWidth) / cellHeight);

        return [x, y];
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
                <Stage width={width} height={height + textAreaHeight + textAreaMargin}>
                    <Layer
                        key="number-link-board-layer"
                        onMouseDown={(e) => {
                            setMouseDown(true);
                            clear(e);
                        }}
                        onMouseUp={() => {
                            slideEnd();
                            setMouseDown(false);
                        }}
                        onMouseMove={(e) => {
                            if (mouseDown) {
                                slide(e);
                            }
                        }}
                        onMouseLeave={() => {
                            slideEnd();
                            setMouseDown(false);
                        }}
                        onTouchStart={(e) => clear(e)}
                        onTouchMove={(e) => {
                            e.evt.preventDefault();
                            slide(e);
                        }}
                        onTouchEnd={() => slideEnd()}
                    >
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
                                {coordinate.routes.map((route) => {
                                    if (route.isSame(Vector.left)) {
                                        return (
                                            <Rect
                                                fill={coordinate.color}
                                                x={cellWidth * coordinate.x - cellWidth / 6 + strokeWidth - margin}
                                                y={cellHeight * coordinate.y + cellHeight / 3 + strokeWidth - margin}
                                                width={cellWidth / 2 + cellWidth / 3 + margin * 2}
                                                height={cellHeight / 3 + margin * 2}
                                                cornerRadius={30}
                                            />
                                        );
                                    } else if (route.isSame(Vector.right)) {
                                        return (
                                            <Rect
                                                fill={coordinate.color}
                                                x={cellWidth * coordinate.x + cellWidth / 2 - cellWidth / 6 + strokeWidth - margin}
                                                y={cellHeight * coordinate.y + cellHeight / 3 + strokeWidth - margin}
                                                width={cellWidth / 2 + cellWidth / 3 + margin * 2}
                                                height={cellHeight / 3 + margin * 2}
                                                cornerRadius={30}
                                            />
                                        );
                                    } else if (route.isSame(Vector.up)) {
                                        return (
                                            <Rect
                                                fill={coordinate.color}
                                                x={cellWidth * coordinate.x + cellHeight / 3 + strokeWidth - margin}
                                                y={cellHeight * coordinate.y - cellHeight / 6 + strokeWidth - margin}
                                                width={cellWidth / 3 + margin * 2}
                                                height={cellHeight / 2 + cellHeight / 3 + margin * 2}
                                                cornerRadius={30}
                                            />
                                        );
                                    } else {
                                        return (
                                            <Rect
                                                fill={coordinate.color}
                                                x={cellWidth * coordinate.x + cellHeight / 3 + strokeWidth - margin}
                                                y={cellHeight * coordinate.y + cellHeight / 2 - cellHeight / 6 + strokeWidth - margin}
                                                width={cellWidth / 3 + margin * 2}
                                                height={cellHeight / 2 + cellHeight / 3 + margin * 2}
                                                cornerRadius={30}
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
                                    fontSize={cellWidth / 2}
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
                            onChange={(e) => {
                                if (!canClick) {
                                    return;
                                }

                                setSize(e.target.value as number);
                            }}
                        >
                            {[...Array(6)].map((_, i) => (
                                <MenuItem value={i + 5}>{i + 5}</MenuItem>
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

    const numberCells = manager.board.cells.flat().filter((x) => x.number);
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

    return coordinates;
}

function getColor(index?: number): string {
    if (!index) {
        return '#AAAAAA';
    }

    switch (index % 7) {
        case 1:
            return '#EE0000';
        case 2:
            return '#00BB00';
        case 3:
            return '#00BBCC';
        case 4:
            return '#FFA500';
        case 5:
            return '#0000FF';
        case 6:
            return '#8A2BE2';
        default:
            return '#FF1493';
    }
}

export default NumberLink;
