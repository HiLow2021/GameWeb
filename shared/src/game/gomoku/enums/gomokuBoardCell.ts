export type GomokuBoardCell = typeof GomokuBoardCell[keyof typeof GomokuBoardCell];

export const GomokuBoardCell = {
    OutOfRange: 'outOfRange',
    Empty: 'empty',
    Black: 'black',
    White: 'white'
} as const;
