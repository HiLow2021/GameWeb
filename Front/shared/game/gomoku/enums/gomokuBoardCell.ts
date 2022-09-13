export type GomokuBoardCell = 'outOfRange' | 'empty' | 'black' | 'white';

export const GomokuBoardCell = {
    outOfRange: 'outOfRange',
    empty: 'empty',
    black: 'black',
    white: 'white'
} as const;
