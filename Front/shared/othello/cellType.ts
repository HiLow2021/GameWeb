export type CellType = 'outOfRange' | 'empty' | 'black' | 'white' | 'highLight';

export const CellType = {
    outOfRange: 'outOfRange',
    empty: 'empty',
    black: 'black',
    white: 'white',
    highLight: 'highLight'
} as const;
