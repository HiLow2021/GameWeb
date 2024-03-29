import { Button, FormControl, FormLabel, MenuItem, Select } from '@mui/material';
import { KonvaEventObject } from 'konva/lib/Node';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Layer, Rect, Stage, Text } from 'react-konva';
import { LightsOutBoardCell } from 'shared/game/lightsOut/enum/lightsOutBoardCell';
import { LightsOutManager } from 'shared/game/lightsOut/lightsOutManager';
import { Coordinate } from '../../shared/game/lightsOut/coordinate';
import { getGameComponentSize } from '../../shared/utility/componentUtility';
import { useContextSound } from '../../shared/utility/soundUtility';

const LightsOut = (): JSX.Element => {
    const { width, height, small } = getGameComponentSize();

    const strokeWidth = small ? 10 : 20;
    const strokeWidthHalf = strokeWidth / 2;
    const margin = 2;
    const textAreaHeight = small ? 44 : 80;
    const textAreaMargin = 16;
    const textStrokeWidth = small ? 2 : 4;
    const textStrokeWidthHalf = textStrokeWidth / 2;

    const [size, setSize] = useState(3);
    const [cellWidth, setCellWidth] = useState((width - strokeWidth * 2) / size);
    const [cellHeight, setCellHeight] = useState((height - strokeWidth * 2) / size);
    const [lightsOutManager, setLightsOutManager] = useState<LightsOutManager>(new LightsOutManager(size, size));
    const [coordinates, setCoordinates] = useState<Coordinate[]>(convertCellsToCoordinates(lightsOutManager.board.cells));
    const [canClick, setCanClick] = useState(true);
    const [initial, setInitial] = useState(true);

    const startSound = useContextSound('game/lightsOut/sound.mp3');

    const select = async (e: KonvaEventObject<Event>): Promise<void> => {
        if (!canClick || lightsOutManager.isCompleted) {
            return;
        }

        const [x, y] = convert(e);
        if (lightsOutManager.next(x, y)) {
            setCanClick(() => false);

            setCoordinates(() => convertCellsToCoordinates(lightsOutManager.board.cells));
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

    useEffect(() => {
        if (initial) {
            setInitial(false);

            return;
        }

        setLightsOutManager(new LightsOutManager(size, size));
    }, [size]);

    useLayoutEffect(() => {
        setCellWidth((width - strokeWidth * 2) / size);
        setCellHeight((height - strokeWidth * 2) / size);
        setCoordinates(() => convertCellsToCoordinates(lightsOutManager.board.cells));
    }, [lightsOutManager, width, height]);

    return (
        <>
            <div className="flex flex-col justify-center gap-4">
                <Stage width={width} height={height + textAreaHeight + textAreaMargin} onClick={select} onTouchStart={select}>
                    <Layer key="lights-out-board-layer" onTouchMove={(e) => e.evt.preventDefault()}>
                        <Rect
                            stroke="black"
                            strokeWidth={strokeWidth}
                            x={strokeWidthHalf - margin}
                            y={strokeWidthHalf - margin}
                            width={width - strokeWidth + margin * 2}
                            height={height - strokeWidth + margin * 2}
                        />
                    </Layer>
                    <Layer key="lights-out-piece-layer" listening={false}>
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
                    <Layer key="lights-out-text-layer" listening={false}>
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
                            text={`Step ${lightsOutManager.step}`}
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
                            text={lightsOutManager.isCompleted ? 'クリア！' : ''}
                            x={width / 2}
                            y={height + textAreaMargin}
                            width={width / 2}
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
                            {[...Array(5)].map((_, i) => (
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
                        color="warning"
                        style={{ fontSize: small ? 18 : 24, fontWeight: small ? 'bold' : 'normal' }}
                        onClick={() => {
                            if (!canClick) {
                                return;
                            }

                            lightsOutManager.initialize();
                            setCoordinates(() => convertCellsToCoordinates(lightsOutManager.board.cells));
                        }}
                    >
                        リセット
                    </Button>
                </div>
            </div>
        </>
    );
};

function convertCellsToCoordinates(cells: LightsOutBoardCell[][]): Coordinate[] {
    const coordinates: Coordinate[] = [];
    for (let y = 0; y < cells.length; y++) {
        for (let x = 0; x < cells[y].length; x++) {
            let coordinate: Coordinate;

            switch (cells[y][x]) {
                case LightsOutBoardCell.On:
                    coordinate = { x, y, color: '#CCCC00' };
                    break;

                case LightsOutBoardCell.Off:
                    coordinate = { x, y, color: '#909090' };
                    break;

                default:
                    continue;
            }

            coordinates.push(coordinate);
        }
    }

    return coordinates;
}

export default LightsOut;
