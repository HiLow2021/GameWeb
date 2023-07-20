import { Button, FormControl, FormLabel, MenuItem, Select } from '@mui/material';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Layer, Rect, Stage, Text } from 'react-konva';
import { NumberLinkManager } from 'shared/game/numberLink/numberLinkManager';
import { Coordinate } from '../../shared/game/numberLink/coordinate';
import { getGameComponentSize } from '../../shared/utility/componentUtility';
import { NumberLinkBoardCellType } from 'shared/game/numberLink/enum/numberLinkBoardCellType';

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
    const [canClick, setCanClick] = useState(true);
    const [initial, setInitial] = useState(true);

    const initialize = async () => {
        await numberLinkManager.initialize();
        setCoordinates(() => convertCellsToCoordinates(numberLinkManager));
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
                        {coordinates.map((coordinate) => (
                            <Rect
                                // fill={coordinate.color}
                                x={cellWidth * coordinate.x + strokeWidth + margin}
                                y={cellHeight * coordinate.y + strokeWidth + margin}
                                width={cellWidth - margin * 2}
                                height={cellHeight - margin * 2}
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

    for (let y = 0; y < manager.board.height; y++) {
        for (let x = 0; x < manager.board.width; x++) {
            const cell = manager.board.get(x, y);
            if (cell?.type === NumberLinkBoardCellType.number) {
                const connectedCoordinates = manager.getConnectedPositions(x, y).flat();
                const number = cell.number ?? -1;

                
            }
        }
    }

    return coordinates;
}

export default NumberLink;
