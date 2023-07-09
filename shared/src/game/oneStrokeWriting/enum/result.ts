export type Result = typeof Result[keyof typeof Result];

export const Result = {
    succeeded: 'succeeded',
    failed: 'failed',
    undecided: 'undecided'
} as const;
