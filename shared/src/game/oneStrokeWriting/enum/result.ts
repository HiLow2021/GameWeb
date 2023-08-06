export type Result = typeof Result[keyof typeof Result];

export const Result = {
    Succeeded: 'succeeded',
    Failed: 'failed',
    Undecided: 'undecided'
} as const;
