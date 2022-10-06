export type ConnectFourBoardCell = 'outOfRange' | 'empty' | 'black' | 'white' | 'highLight';

export const ConnectFourBoardCell = {
    outOfRange: 'outOfRange',
    empty: 'empty',
    black: 'black',
    white: 'white',
    highLight: 'highLight'
} as const;
