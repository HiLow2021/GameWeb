export type Level = typeof Level[keyof typeof Level];

export const Level = {
    normal: 'normal'
} as const;
