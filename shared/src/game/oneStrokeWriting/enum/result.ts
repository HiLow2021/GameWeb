export type Result = 'succeeded' | 'failed' | 'undecided';

export const Result = {
    succeeded: 'succeeded',
    failed: 'failed',
    undecided: 'undecided'
} as const;
