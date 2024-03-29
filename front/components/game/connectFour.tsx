import { Button, FormControl, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, Select, Typography } from '@mui/material';
import { KonvaEventObject } from 'konva/lib/Node';
import { useEffect, useState } from 'react';
import { Group, Layer, Rect, Stage, Text } from 'react-konva';
import { ConnectFourManager } from 'shared/game/connectFour/connectFourManager';
import { ConnectFourBoardCell } from 'shared/game/connectFour/enums/connectFourBoardCell';
import { Result } from 'shared/game/connectFour/enums/result';
import { Turn } from 'shared/game/connectFour/enums/turn';
import { CommonUtility } from 'shared/utility/commonUtility';
import { Coordinate } from '../../shared/game/connectFour/coordinate';
import { Level } from '../../shared/game/connectFour/level';
import { Player } from '../../shared/game/connectFour/player';
import { getGameComponentSize } from '../../shared/utility/componentUtility';
import { useContextSound } from '../../shared/utility/soundUtility';

const ConnectFour = (): JSX.Element => {
    const { width, height, small } = getGameComponentSize();

    const widthSize = 8;
    const heightSize = 8;
    const outerStrokeWidth = small ? 10 : 20;
    const outerStrokeWidthHalf = outerStrokeWidth / 2;
    const innerStrokeWidth = small ? 1 : 2;
    const innerStrokeWidthHalf = innerStrokeWidth / 2;
    const cellWidth = (width - outerStrokeWidth * 2) / widthSize;
    const cellHeight = (height - outerStrokeWidth * 2) / heightSize;
    const textAreaHeight = small ? 44 : 80;
    const textAreaMargin = 16;
    const textStrokeWidth = small ? 2 : 4;
    const textStrokeWidthHalf = textStrokeWidth / 2;

    const [connectFourManager] = useState<ConnectFourManager>(new ConnectFourManager(widthSize, heightSize));
    const [coordinates, setCoordinates] = useState<Coordinate[]>(convertCellsToCoordinates(connectFourManager.board.cells));
    const [canClick, setCanClick] = useState(true);

    const [player, setPlayer] = useState<Player>(Player.black);
    const [level, setLevel] = useState<Level>(Level.normal);

    const startSound = useContextSound('game/connectFour/sound.mp3');

    const initialize = async () => {
        connectFourManager.initialize();

        if (player === Player.white) {
            await connectFourManager.nextByAI();
            startSound();
        }

        setCoordinates(() => convertCellsToCoordinates(connectFourManager.board.cells));
    };

    const select = async (e: KonvaEventObject<Event>): Promise<void> => {
        if (!canClick) {
            return;
        }

        const [x, y] = convert(e);
        if (connectFourManager.next(x, y)) {
            setCanClick(() => false);

            setCoordinates(() => convertCellsToCoordinates(connectFourManager.board.cells));
            startSound();

            if (!connectFourManager.isFinished) {
                await CommonUtility.delay(500);
                await connectFourManager.nextByAI();

                setCoordinates(() => convertCellsToCoordinates(connectFourManager.board.cells));
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

            const x = Math.floor((position.x - outerStrokeWidth) / cellWidth);
            const y = Math.floor((position.y - outerStrokeWidth) / cellHeight);

            return [x, y];
        }
    };

    useEffect(() => {
        initialize();
    }, [player, level]);

    return (
        <>
            <div className="flex flex-col justify-center gap-4">
                <Stage width={width} height={height + textAreaHeight + textAreaMargin} onClick={select} onTouchStart={select}>
                    <Layer key="connect-four-board-layer" onTouchMove={(e) => e.evt.preventDefault()}>
                        <Rect
                            stroke="black"
                            strokeWidth={outerStrokeWidth}
                            x={outerStrokeWidthHalf}
                            y={outerStrokeWidthHalf}
                            width={width - outerStrokeWidth}
                            height={height - outerStrokeWidth}
                        />
                    </Layer>
                    <Layer key="connect-four-cell-layer" listening={false}>
                        {coordinates.map((coordinate) =>
                            coordinate.stone ? (
                                <Group>
                                    <Rect
                                        x={cellWidth * coordinate.x + outerStrokeWidth}
                                        y={cellHeight * coordinate.y + outerStrokeWidth}
                                        width={cellWidth}
                                        height={cellHeight}
                                        fillPriority="linear-gradient"
                                        fillLinearGradientStartPoint={{ x: 0, y: 0 }}
                                        fillLinearGradientEndPoint={{ x: cellWidth, y: cellHeight }}
                                        fillLinearGradientColorStops={[0, coordinate.innerColorStart, 1, coordinate.innerColorEnd]}
                                    />
                                    <Rect
                                        stroke={coordinate.borderColor}
                                        strokeWidth={innerStrokeWidth}
                                        x={cellWidth * coordinate.x + outerStrokeWidth + innerStrokeWidthHalf}
                                        y={cellHeight * coordinate.y + outerStrokeWidth + innerStrokeWidthHalf}
                                        width={cellWidth - innerStrokeWidth}
                                        height={cellHeight - innerStrokeWidth}
                                    />
                                </Group>
                            ) : !isOpponent(player, connectFourManager.currentTurn) ? (
                                <Rect
                                    stroke={coordinate.borderColor}
                                    strokeWidth={innerStrokeWidth}
                                    dash={[2, 4]}
                                    x={cellWidth * coordinate.x + outerStrokeWidth + innerStrokeWidthHalf}
                                    y={cellHeight * coordinate.y + outerStrokeWidth + innerStrokeWidthHalf}
                                    width={cellWidth - innerStrokeWidth}
                                    height={cellHeight - innerStrokeWidth}
                                />
                            ) : (
                                <></>
                            )
                        )}
                    </Layer>
                    <Layer key="connect-four-text-layer" listening={false}>
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
                            text={displayText(connectFourManager.result, connectFourManager.currentTurn, player)}
                            x={0}
                            y={height + textAreaMargin}
                            width={width}
                            height={textAreaHeight}
                            fill="black"
                            fontSize={small ? 22 : 32}
                            align="center"
                            verticalAlign="middle"
                        />
                    </Layer>
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
                                label={<Typography sx={{ fontSize: small ? 14 : 16 }}>先手 (赤)</Typography>}
                            />
                            <FormControlLabel
                                value="white"
                                control={<Radio size={small ? 'small' : 'medium'} />}
                                label={<Typography sx={{ fontSize: small ? 14 : 16 }}>後手 (黄)</Typography>}
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
                        color="error"
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

function convertCellsToCoordinates(cells: ConnectFourBoardCell[][]): Coordinate[] {
    const coordinates: Coordinate[] = [];
    for (let y = 0; y < cells.length; y++) {
        for (let x = 0; x < cells[y].length; x++) {
            let coordinate: Coordinate;

            switch (cells[y][x]) {
                case ConnectFourBoardCell.Black:
                    coordinate = { x, y, borderColor: 'gray', innerColorStart: '#EE0000', innerColorEnd: '#BB0000', stone: true };
                    break;

                case ConnectFourBoardCell.White:
                    coordinate = { x, y, borderColor: 'gray', innerColorStart: '#EEEE00', innerColorEnd: '#BBBB00', stone: true };
                    break;

                case ConnectFourBoardCell.HighLight:
                    coordinate = { x, y, borderColor: 'gray', innerColorStart: '', innerColorEnd: '', stone: false };
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
    return (currentTurn === Turn.White && player === Player.black) || (currentTurn === Turn.Black && player === Player.white);
}

function displayText(result: Result, currentTurn: Turn, player: Player): string {
    if (result === Result.Undecided) {
        if ((currentTurn === Turn.Black && player === Player.black) || (currentTurn === Turn.White && player === Player.white)) {
            return 'プレイヤーのターンです';
        } else {
            return 'AIのターンです';
        }
    } else if (result === Result.Draw) {
        return '引き分けです';
    } else if ((result === Result.Black && player === Player.black) || (result === Result.White && player === Player.white)) {
        return 'プレイヤーの勝利です';
    } else {
        return 'AIの勝利です';
    }
}

export default ConnectFour;
