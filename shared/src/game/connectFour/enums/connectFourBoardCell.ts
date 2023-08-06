export type ConnectFourBoardCell = typeof ConnectFourBoardCell[keyof typeof ConnectFourBoardCell];

export const ConnectFourBoardCell = {
    OutOfRange: 'outOfRange',
    Empty: 'empty',
    Black: 'black',
    White: 'white',
    HighLight: 'highLight'
} as const;
