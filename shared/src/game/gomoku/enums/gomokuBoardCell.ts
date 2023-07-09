export type GomokuBoardCell = typeof GomokuBoardCell[keyof typeof GomokuBoardCell];

export const GomokuBoardCell = {
    outOfRange: 'outOfRange',
    empty: 'empty',
    black: 'black',
    white: 'white'
} as const;
