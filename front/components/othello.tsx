import { FormControl, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Select } from '@mui/material';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { Ellipse, FastLayer, Line, Rect, Stage, Text } from 'react-konva';
import { OthelloBoardCell } from 'shared/game/othello/enums/othelloBoardCell';
import { Result } from 'shared/game/othello/enums/result';
import { Turn } from 'shared/game/othello/enums/turn';
import { OthelloBoard } from 'shared/game/othello/othelloBoard';
import { OthelloManager } from 'shared/game/othello/othelloManager';
import { CommonUtility } from 'shared/utility/commonUtility';
import useSound from 'use-sound';
import { Coordinate } from '../shared/game/othello/coordinate';
import { Level } from '../shared/game/othello/level';
import { Player } from '../shared/game/othello/player';

const Othello = ({ width, height }: { width: number; height: number }): JSX.Element => {
    const size = 8;
    const sizeHalf = size / 2;
    const cellWidth = width / size;
    const cellHeight = height / size;
    const textAreaHeight = 80;
    const strokeWidth = 4;
    const strokeWidthHalf = strokeWidth / 2;

    const [othelloManager] = useState<OthelloManager>(new OthelloManager(size));
    const [coordinates, setCoordinates] = useState<Coordinate[]>(convertCellsToCoordinates(othelloManager.board.cells));
    const [mouseCoordinate, setMouseCoordinate] = useState<Coordinate>();
    const [canClick, setCanClick] = useState(true);

    const [player, setPlayer] = useState<Player>(Player.black);
    const [level, setLevel] = useState<Level>(Level.normal);

    const [sound] = useSound('game/othello/sound.mp3');

    const initialize = async () => {
        othelloManager.initialize();

        if (player === Player.white) {
            await othelloManager.nextByAI(Level.toLogicValue(level));
            sound();
        }

        setCoordinates((_) => convertCellsToCoordinates(othelloManager.board.cells));
    };

    useEffect(() => {
        initialize();
    }, [player, level]);

    return (
        <>
            <div className="flex flex-col justify-center gap-4">
                <Stage
                    width={width + strokeWidth}
                    height={height + strokeWidth + textAreaHeight}
                    onClick={async (e) => {
                        if (!canClick) {
                            return;
                        }

                        const x = Math.floor(e.evt.offsetX / cellWidth);
                        const y = Math.floor(e.evt.offsetY / cellHeight);

                        if (othelloManager.next(x, y)) {
                            setCanClick((_) => false);
                            setCoordinates((_) => convertCellsToCoordinates(othelloManager.board.cells));
                            sound();

                            while (isOpponent(player, othelloManager.currentTurn) && othelloManager.result === Result.undecided) {
                                await CommonUtility.delay(500);
                                await othelloManager.nextByAI(Level.toLogicValue(level));

                                setCoordinates((_) => convertCellsToCoordinates(othelloManager.board.cells));
                                sound();
                            }

                            setCanClick((_) => true);
                        }
                    }}
                    onMouseMove={(e) => {
                        const x = Math.floor(e.evt.offsetX / cellWidth);
                        const y = Math.floor(e.evt.offsetY / cellHeight);

                        setMouseCoordinate((_) => ({ x, y, color: 'pink', stone: false }));
                    }}
                >
                    <FastLayer key="othello-board-layer">
                        <Rect fill="green" width={width} height={height} />
                        <Rect
                            stroke="black"
                            strokeWidth={strokeWidth}
                            x={strokeWidthHalf}
                            y={strokeWidthHalf}
                            width={width}
                            height={height}
                        />
                        {[...Array(size - 1)].map((_, i) => (
                            <Line
                                stroke="black"
                                strokeWidth={strokeWidth}
                                points={[cellWidth * (i + 1) + strokeWidthHalf, 0, cellWidth * (i + 1) + strokeWidthHalf, height]}
                            />
                        ))}
                        {[...Array(size - 1)].map((_, i) => (
                            <Line
                                stroke="black"
                                strokeWidth={strokeWidth}
                                points={[0, cellHeight * (i + 1) + strokeWidthHalf, width, cellHeight * (i + 1) + strokeWidthHalf]}
                            />
                        ))}
                        {[sizeHalf - 2, sizeHalf + 2].map((y) =>
                            [sizeHalf - 2, sizeHalf + 2].map((x) => (
                                <Ellipse
                                    fill="black"
                                    x={cellWidth * x + strokeWidthHalf}
                                    y={cellHeight * y + strokeWidthHalf}
                                    radiusX={cellWidth / 10}
                                    radiusY={cellHeight / 10}
                                />
                            ))
                        )}
                    </FastLayer>
                    <FastLayer key="othello-cell-layer">
                        {coordinates.map((coordinate) =>
                            coordinate.stone ? (
                                <Ellipse
                                    fill={coordinate.color}
                                    x={cellWidth * coordinate.x + cellWidth / 2 + strokeWidthHalf}
                                    y={cellHeight * coordinate.y + cellHeight / 2 + strokeWidthHalf}
                                    radiusX={cellWidth / 3}
                                    radiusY={cellHeight / 3}
                                />
                            ) : !isOpponent(player, othelloManager.currentTurn) ? (
                                <Rect
                                    stroke={coordinate.color}
                                    strokeWidth={strokeWidth}
                                    x={cellWidth * coordinate.x + strokeWidth + strokeWidthHalf}
                                    y={cellHeight * coordinate.y + strokeWidth + strokeWidthHalf}
                                    width={cellWidth - strokeWidth * 2}
                                    height={cellHeight - strokeWidth * 2}
                                />
                            ) : (
                                <></>
                            )
                        )}
                    </FastLayer>
                    <FastLayer key="othello-mouse-layer">
                        {mouseCoordinate && mouseCoordinate.y < size ? (
                            <Rect
                                stroke={mouseCoordinate.color}
                                strokeWidth={strokeWidth}
                                x={cellWidth * mouseCoordinate.x + strokeWidth + strokeWidthHalf}
                                y={cellHeight * mouseCoordinate.y + strokeWidth + strokeWidthHalf}
                                width={cellWidth - strokeWidth * 2}
                                height={cellHeight - strokeWidth * 2}
                            />
                        ) : (
                            <></>
                        )}
                    </FastLayer>
                    <FastLayer key="othello-text-layer">
                        <Rect fill="#505050" x={0} y={height + strokeWidth} width={width + strokeWidth} height={textAreaHeight} />
                        <Rect
                            stroke="black"
                            strokeWidth={strokeWidth}
                            x={strokeWidthHalf}
                            y={height + strokeWidthHalf}
                            width={width}
                            height={textAreaHeight}
                        />
                        <Ellipse
                            fill="black"
                            x={cellWidth + strokeWidthHalf}
                            y={height + cellHeight / 2 + strokeWidthHalf}
                            radiusX={cellWidth / 3}
                            radiusY={cellHeight / 3}
                        />
                        <Text
                            text={displayCount(othelloManager.board, OthelloBoardCell.black)}
                            x={cellWidth / 2}
                            y={height}
                            width={cellWidth + strokeWidth}
                            height={textAreaHeight}
                            fill="white"
                            fontSize={32}
                            align="center"
                            verticalAlign="middle"
                        />
                        <Ellipse
                            fill="white"
                            x={cellWidth * (size - 1) + strokeWidthHalf}
                            y={height + cellHeight / 2 + strokeWidthHalf}
                            radiusX={cellWidth / 3}
                            radiusY={cellHeight / 3}
                        />
                        <Text
                            text={displayCount(othelloManager.board, OthelloBoardCell.white)}
                            x={cellWidth * (size - 1) - cellWidth / 2}
                            y={height}
                            width={cellWidth + strokeWidth}
                            height={textAreaHeight}
                            fill="black"
                            fontSize={32}
                            align="center"
                            verticalAlign="middle"
                        />
                        <Text
                            text={displayText(othelloManager.result, othelloManager.currentTurn, player)}
                            x={0}
                            y={height}
                            width={width}
                            height={textAreaHeight}
                            fill="white"
                            fontSize={32}
                            align="center"
                            verticalAlign="middle"
                        />
                    </FastLayer>
                </Stage>
                <div className="flex justify-center gap-12 border-4 border-gray-600 bg-gray-300 py-4">
                    <FormControl sx={{ flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                        <FormLabel id="radio-buttons-group-label" sx={{ fontWeight: 'bold', fontSize: 20 }}>
                            順番
                        </FormLabel>
                        <RadioGroup
                            row
                            aria-labelledby="radio-buttons-group-label"
                            value={player}
                            onChange={async (e) => {
                                if (!canClick) {
                                    return;
                                }

                                setPlayer(e.target.value as Player);
                            }}
                        >
                            <FormControlLabel value="black" control={<Radio />} label="先手 (黒)" />
                            <FormControlLabel value="white" control={<Radio />} label="後手 (白)" />
                        </RadioGroup>
                    </FormControl>
                    <FormControl sx={{ flexDirection: 'row', alignItems: 'center', gap: '1rem', m: 1, minWidth: 100 }}>
                        <FormLabel id="radio-buttons-group-label" sx={{ fontWeight: 'bold', fontSize: 20 }}>
                            難易度
                        </FormLabel>
                        <Select
                            labelId="simple-select-label"
                            id="simple-select"
                            value={level}
                            onChange={async (e) => {
                                if (!canClick) {
                                    return;
                                }

                                setLevel(e.target.value as Level);
                            }}
                        >
                            <MenuItem value={'easy'}>弱い</MenuItem>
                            <MenuItem value={'normal'}>普通</MenuItem>
                        </Select>
                    </FormControl>
                </div>
                <div className="flex justify-end">
                    <Button
                        className="h-12 w-48"
                        fullWidth={false}
                        variant="contained"
                        color="success"
                        style={{ fontSize: 24 }}
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

function convertCellsToCoordinates(cells: OthelloBoardCell[][]): Coordinate[] {
    const coordinates: Coordinate[] = [];
    for (let y = 0; y < cells.length; y++) {
        for (let x = 0; x < cells[y].length; x++) {
            let coordinate: Coordinate;

            switch (cells[y][x]) {
                case 'black':
                    coordinate = { x, y, color: 'black', stone: true };
                    break;

                case 'white':
                    coordinate = { x, y, color: 'white', stone: true };
                    break;

                case 'highLight':
                    coordinate = { x, y, color: 'orange', stone: false };
                    break;

                default:
                    continue;
            }

            coordinates.push(coordinate);
        }
    }

    return coordinates;
}

function isOpponent(currentTurn: Turn, player: Player): boolean {
    return (currentTurn === Turn.white && player === Player.black) || (currentTurn === Turn.black && player === Player.white);
}

function displayCount(board: OthelloBoard, cell: OthelloBoardCell): string {
    return board.getCount(cell).toString();
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

export default Othello;
