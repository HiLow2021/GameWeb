export type Turn = 'black' | 'white' | 'finished';

export const Turn = {
    black: 'black',
    white: 'white',
    finished: 'finished'
} as const;
