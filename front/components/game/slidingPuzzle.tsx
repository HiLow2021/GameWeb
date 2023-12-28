import { Button, FormControl, FormLabel, MenuItem, Select } from '@mui/material';
import { KonvaEventObject } from 'konva/lib/Node';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Image, Layer, Rect, Stage, Text } from 'react-konva';
import { SlidingPuzzleManager } from 'shared/game/slidingPuzzle/slidingPuzzleManager';
import { RandomUtility } from 'shared/utility/randomUtility';
import { Coordinate } from '../../shared/game/slidingPuzzle/coordinate';
import { getGameComponentSize } from '../../shared/utility/componentUtility';
import { useContextSound } from '../../shared/utility/soundUtility';

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
    const imageDirectory = `game/slidingPuzzle/${width}/`;
    const imageCountMax = 23; // 'public/game/slidingPuzzle/XXX/' の画像ファイル数に合わせる。

    const [size, setSize] = useState(4);
    const [cellWidth, setCellWidth] = useState((width - outerStrokeWidth * 2) / size);
    const [cellHeight, setCellHeight] = useState((height - outerStrokeWidth * 2) / size);
    const [slidingPuzzleManager, setSlidingPuzzleManager] = useState<SlidingPuzzleManager>(new SlidingPuzzleManager(size, size));
    const [coordinates, setCoordinates] = useState<Coordinate[]>(convertCellsToCoordinates(slidingPuzzleManager.board.cells));
    const [imageNumber, setImageNumber] = useState(getRandomString(1, imageCountMax));
    const [imagePath, setImagePath] = useState(`${imageDirectory}${imageNumber}.webp`);
    const [canClick, setCanClick] = useState(true);
    const [initial, setInitial] = useState(true);

    const image = new window.Image();
    image.src = imagePath;

    const startSound = useContextSound('game/slidingPuzzle/sound.mp3');

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

        setSlidingPuzzleManager(new SlidingPuzzleManager(size, size));
        setImageNumber(getRandomString(1, imageCountMax));
    }, [size]);

    useLayoutEffect(() => {
        setCellWidth((width - outerStrokeWidth * 2) / size);
        setCellHeight((height - outerStrokeWidth * 2) / size);
        setImagePath(`${imageDirectory}${imageNumber}.webp`);
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
                    <Layer key="sliding-puzzle-piece-layer" listening={false}>
                        {coordinates.map((coordinate) =>
                            coordinate.number !== slidingPuzzleManager.missingNumber && coordinate.number != undefined ? (
                                <Image
                                    image={image}
                                    x={cellWidth * coordinate.x + outerStrokeWidth + innerStrokeWidthHalf}
                                    y={cellHeight * coordinate.y + outerStrokeWidth + innerStrokeWidthHalf}
                                    width={cellWidth - innerStrokeWidth}
                                    height={cellHeight - innerStrokeWidth}
                                    crop={{
                                        x: cellWidth * (coordinate.number % size) + outerStrokeWidth + innerStrokeWidthHalf,
                                        y: cellHeight * Math.floor(coordinate.number / size) + outerStrokeWidth + innerStrokeWidthHalf,
                                        width: cellWidth,
                                        height: cellHeight
                                    }}
                                />
                            ) : (
                                <></>
                            )
                        )}
                    </Layer>
                    <Layer key="sliding-puzzle-text-layer" listening={false}>
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
                            {[...Array(3)].map((_, i) => (
                                <MenuItem value={i + 3}>{i + 3}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="flex justify-center gap-4 sm:justify-end">
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

                            slidingPuzzleManager.reset();
                            setCoordinates(() => convertCellsToCoordinates(slidingPuzzleManager.board.cells));
                        }}
                    >
                        リセット
                    </Button>
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
                            setImageNumber(getRandomString(1, imageCountMax));
                            setImagePath(`${imageDirectory}${imageNumber}.webp`);
                            setCoordinates(() => convertCellsToCoordinates(slidingPuzzleManager.board.cells));
                        }}
                    >
                        次の問題
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

function getRandomString(min: number, max: number): string {
    const digit = max < 10 ? 2 : max.toString().length;
    const number = RandomUtility.random(min, max + 1);
    const numberString = number.toString().padStart(digit, '0');

    return numberString;
}

export default SlidingPuzzle;
