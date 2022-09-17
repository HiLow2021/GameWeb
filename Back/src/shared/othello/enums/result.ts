export type Result = 'black' | 'white' | 'draw' | 'undecided';

export const Result = {
    black: 'black',
    white: 'white',
    draw: 'draw',
    undecided: 'undecided'
} as const;
