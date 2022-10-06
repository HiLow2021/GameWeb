export type ConnectFourBoardCell = 'outOfRange' | 'empty' | 'black' | 'white';

export const ConnectFourBoardCell = {
    outOfRange: 'outOfRange',
    empty: 'empty',
    black: 'black',
    white: 'white'
} as const;
