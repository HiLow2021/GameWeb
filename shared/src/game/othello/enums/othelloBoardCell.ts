export type OthelloBoardCell = typeof OthelloBoardCell[keyof typeof OthelloBoardCell];

export const OthelloBoardCell = {
    OutOfRange: 'outOfRange',
    Empty: 'empty',
    Black: 'black',
    White: 'white',
    HighLight: 'highLight'
} as const;
