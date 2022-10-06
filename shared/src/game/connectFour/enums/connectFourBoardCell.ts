export type ConnectFourBoardCell = 'outOfRange' | 'ground' | 'empty' | 'black' | 'white';

export const ConnectFourBoardCell = {
    outOfRange: 'outOfRange',
    ground: 'ground',
    empty: 'empty',
    black: 'black',
    white: 'white'
} as const;
