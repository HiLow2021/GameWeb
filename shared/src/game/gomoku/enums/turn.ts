export type Turn = typeof Turn[keyof typeof Turn];

export const Turn = {
    black: 'black',
    white: 'white'
} as const;
