export type Result = typeof Result[keyof typeof Result];

export const Result = {
    Black: 'black',
    White: 'white',
    Draw: 'draw',
    Undecided: 'undecided'
} as const;
