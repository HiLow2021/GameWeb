export type ConnectFourBoardCell = typeof ConnectFourBoardCell[keyof typeof ConnectFourBoardCell];

export const ConnectFourBoardCell = {
    outOfRange: 'outOfRange',
    empty: 'empty',
    black: 'black',
    white: 'white',
    highLight: 'highLight'
} as const;
