export type OthelloBoardCell = 'outOfRange' | 'empty' | 'black' | 'white' | 'highLight';

export const OthelloBoardCell = {
    outOfRange: 'outOfRange',
    empty: 'empty',
    black: 'black',
    white: 'white',
    highLight: 'highLight'
} as const;
