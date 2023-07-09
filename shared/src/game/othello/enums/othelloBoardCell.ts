export type OthelloBoardCell = typeof OthelloBoardCell[keyof typeof OthelloBoardCell];

export const OthelloBoardCell = {
    outOfRange: 'outOfRange',
    empty: 'empty',
    black: 'black',
    white: 'white',
    highLight: 'highLight'
} as const;
