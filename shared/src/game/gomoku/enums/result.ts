export type Result = typeof Result[keyof typeof Result];

export const Result = {
    black: 'black',
    white: 'white',
    draw: 'draw',
    undecided: 'undecided'
} as const;
