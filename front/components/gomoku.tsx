import { Button, FormControl, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Select, Typography } from '@mui/material';
import { KonvaEventObject } from 'konva/lib/Node';
import { useContext, useEffect, useState } from 'react';
import { Ellipse, FastLayer, Layer, Line, Rect, Stage, Text } from 'react-konva';
import { GomokuBoardCell } from 'shared/game/gomoku/enums/gomokuBoardCell';
import { Result } from 'shared/game/gomoku/enums/result';
import { Turn } from 'shared/game/gomoku/enums/turn';
import { GomokuManager } from 'shared/game/gomoku/gomokuManager';
import { CommonUtility } from 'shared/utility/commonUtility';
import useSound from 'use-sound';
import SoundStateContext from '../contexts/soundStateContext';
import { Coordinate } from '../shared/game/gomoku/coordinate';
import { Level } from '../shared/game/gomoku/level';
import { Player } from '../shared/game/gomoku/player';
import { getGameComponentSize } from '../shared/utility/componentUtility';

const Gomoku = (): JSX.Element => {
    const { width, height, small } = getGameComponentSize();

    const widthSize = 14;
    const heightSize = 14;
    const widthSizeHalf = Math.floor(widthSize / 2);
    const heightSizeHalf = Math.floor(heightSize / 2);
    const strokeWidth = small ? 2 : 4;
    const strokeWidthHalf = strokeWidth / 2;
    const cellWidth = (width - strokeWidth * 2 - strokeWidth * widthSize) / widthSize;
    const cellHeight = (height - strokeWidth * 2 - strokeWidth * heightSize) / heightSize;
    const cellWidthHalf = cellWidth / 2;
    const cellHeightHalf = cellHeight / 2;
    const textAreaHeight = small ? 44 : 80;

    const [gomokuManager] = useState<GomokuManager>(new GomokuManager(widthSize, heightSize));
    const [coordinates, setCoordinates] = useState<Coordinate[]>(convertCellsToCoordinates(gomokuManager.board.cells));
    const [canClick, setCanClick] = useState(true);

    const [player, setPlayer] = useState<Player>(Player.black);
    const [level, setLevel] = useState<Level>(Level.normal);

    const { currentSoundState } = useContext(SoundStateContext);
    const [sound] = useSound('game/gomoku/sound.mp3');
    const startSound = () => {
        if (currentSoundState) {
            sound();
        }
    };

    const initialize = async () => {
        gomokuManager.initialize();

        if (player === Player.white) {
            await gomokuManager.nextByAI();
            startSound();
        }

        setCoordinates(() => convertCellsToCoordinates(gomokuManager.board.cells));
    };

    const select = async (e: KonvaEventObject<Event>): Promise<void> => {
        if (!canClick) {
            return;
        }

        const [x, y] = convert(e);
        if (gomokuManager.next(x, y)) {
            setCanClick(() => false);

            setCoordinates(() => convertCellsToCoordinates(gomokuManager.board.cells));
            startSound();

            if (!gomokuManager.isFinished) {
                await CommonUtility.delay(500);
                await gomokuManager.nextByAI();

                setCoordinates(() => convertCellsToCoordinates(gomokuManager.board.cells));
                startSound();
            }

            setCanClick(() => true);
        }

        function convert(e: KonvaEventObject<Event>): number[] {
            const stage = e.target.getStage();
            const position = stage?.getPointerPosition();
            if (!position) {
                return [-1, -1];
            }

            const x = Math.floor((position.x - strokeWidth) / (cellWidth + strokeWidth));
            const y = Math.floor((position.y - strokeWidth) / (cellHeight + strokeWidth));

            return [x, y];
        }
    };

    useEffect(() => {
        initialize();
    }, [player, level]);

    return (
        <>
            <div className="flex flex-col justify-center gap-4">
                <Stage width={width} height={height + textAreaHeight} onClick={select} onTouchStart={select}>
                    <Layer key="gomoku-board-layer" onTouchMove={(e) => e.evt.preventDefault()}>
                        <Rect fill="#f5deb3" width={width} height={height} />
                        <Rect
                            stroke="black"
                            strokeWidth={strokeWidth}
                            x={strokeWidthHalf}
                            y={strokeWidthHalf}
                            width={width - strokeWidth}
                            height={height - strokeWidth}
                        />
                        {[...Array(widthSize + 1)].map((_, i) => (
                            <Line
                                stroke="black"
                                strokeWidth={strokeWidth}
                                points={[
                                    cellWidthHalf + (cellWidth + strokeWidth) * i + strokeWidth + strokeWidthHalf,
                                    cellHeightHalf + strokeWidth + strokeWidthHalf,
                                    cellWidthHalf + (cellWidth + strokeWidth) * i + strokeWidth + strokeWidthHalf,
                                    height - cellHeightHalf - strokeWidth
                                ]}
                            />
                        ))}
                        {[...Array(heightSize + 1)].map((_, i) => (
                            <Line
                                stroke="black"
                                strokeWidth={strokeWidth}
                                points={[
                                    cellWidthHalf + strokeWidth,
                                    cellHeightHalf + (cellHeight + strokeWidth) * i + strokeWidth + strokeWidthHalf,
                                    width - cellWidthHalf - strokeWidth,
                                    cellHeightHalf + (cellHeight + strokeWidth) * i + strokeWidth + strokeWidthHalf
                                ]}
                            />
                        ))}
                        {[heightSizeHalf - 4, heightSizeHalf + 3].map((y) =>
                            [widthSizeHalf - 4, widthSizeHalf + 3].map((x) => (
                                <Ellipse
                                    fill="black"
                                    x={cellWidthHalf + (cellWidth + strokeWidth) * x + strokeWidth + strokeWidthHalf}
                                    y={cellHeightHalf + (cellHeight + strokeWidth) * y + strokeWidth + strokeWidthHalf}
                                    radiusX={cellWidth / 6}
                                    radiusY={cellHeight / 6}
                                />
                            ))
                        )}
                    </Layer>
                    <FastLayer key="gomoku-cell-layer">
                        {coordinates.map((coordinate) => (
                            <Ellipse
                                fill={coordinate.color}
                                x={cellWidthHalf + (cellWidth + strokeWidth) * coordinate.x + strokeWidth + strokeWidthHalf}
                                y={cellHeightHalf + (cellHeight + strokeWidth) * coordinate.y + strokeWidth + strokeWidthHalf}
                                radiusX={cellWidth / 2.5}
                                radiusY={cellHeight / 2.5}
                            />
                        ))}
                    </FastLayer>
                    <FastLayer key="gomoku-text-layer">
                        <Rect fill="#606060" x={0} y={height} width={width} height={textAreaHeight} />
                        <Rect
                            stroke="black"
                            strokeWidth={strokeWidth}
                            x={strokeWidthHalf}
                            y={height - strokeWidthHalf}
                            width={width - strokeWidth}
                            height={textAreaHeight}
                        />
                        <Text
                            text={displayText(gomokuManager.result, gomokuManager.currentTurn, player)}
                            x={0}
                            y={height}
                            width={width}
                            height={textAreaHeight}
                            fill="white"
                            fontSize={small ? 18 : 32}
                            fontStyle={small ? 'bold' : 'normal'}
                            align="center"
                            verticalAlign="middle"
                        />
                    </FastLayer>
                </Stage>
                <div className="flex justify-center border-2 border-gray-600 bg-gray-300 py-2 sm:gap-12 sm:border-4 sm:py-4">
                    <FormControl sx={{ flexDirection: small ? 'column' : 'row', alignItems: 'center', gap: small ? '0.25rem' : '1rem' }}>
                        <FormLabel id="radio-buttons-group-label" sx={{ fontWeight: 'bold', fontSize: small ? 16 : 20 }}>
                            順番
                        </FormLabel>
                        <RadioGroup
                            row={!small}
                            aria-labelledby="radio-buttons-group-label"
                            value={player}
                            onChange={async (e) => {
                                if (!canClick) {
                                    return;
                                }

                                setPlayer(e.target.value as Player);
                            }}
                        >
                            <FormControlLabel
                                value="black"
                                control={<Radio size={small ? 'small' : 'medium'} />}
                                label={<Typography sx={{ fontSize: small ? 14 : 16 }}>先手 (黒)</Typography>}
                            />
                            <FormControlLabel
                                value="white"
                                control={<Radio size={small ? 'small' : 'medium'} />}
                                label={<Typography sx={{ fontSize: small ? 14 : 16 }}>後手 (白)</Typography>}
                            />
                        </RadioGroup>
                    </FormControl>
                    <FormControl sx={{ flexDirection: small ? 'column' : 'row', alignItems: 'center', gap: '1rem', minWidth: 100 }}>
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
                        onClick={async () => {
                            if (!canClick) {
                                return;
                            }

                            await initialize();
                        }}
                    >
                        リセット
                    </Button>
                </div>
            </div>
        </>
    );
};

function convertCellsToCoordinates(cells: GomokuBoardCell[][]): Coordinate[] {
    const coordinates: Coordinate[] = [];
    for (let y = 0; y < cells.length; y++) {
        for (let x = 0; x < cells[y].length; x++) {
            let coordinate: Coordinate;

            switch (cells[y][x]) {
                case 'black':
                    coordinate = { x, y, color: 'black' };
                    break;

                case 'white':
                    coordinate = { x, y, color: 'white' };
                    break;

                default:
                    continue;
            }

            coordinates.push(coordinate);
        }
    }

    return coordinates;
}

function displayText(result: Result, currentTurn: Turn, player: Player): string {
    if (result === Result.undecided) {
        if ((currentTurn === Turn.black && player === Player.black) || (currentTurn === Turn.white && player === Player.white)) {
            return 'プレイヤーのターンです';
        } else {
            return 'AIのターンです';
        }
    } else if (result === Result.draw) {
        return '引き分けです';
    } else if ((result === Result.black && player === Player.black) || (result === Result.white && player === Player.white)) {
        return 'プレイヤーの勝利です';
    } else {
        return 'AIの勝利です';
    }
}

export default Gomoku;
