export type Level = typeof Level[keyof typeof Level];

export const Level = {
    normal: 'normal',
    hard: 'hard'
} as const;
