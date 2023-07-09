export type Player = typeof Player[keyof typeof Player];

export const Player = {
    black: 'black',
    white: 'white'
} as const;
