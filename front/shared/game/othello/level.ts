export type Level = typeof Level[keyof typeof Level];

export const Level = {
    easy: 'easy',
    normal: 'normal'
} as const;

export function toLogicValue(level: Level): number {
    switch (level) {
        case Level.easy:
            return 1000;
        case Level.normal:
            return 10000;
        default:
            // eslint-disable-next-line no-case-declarations, @typescript-eslint/no-unused-vars
            const _: never = level;
            throw new TypeError('未定義の難易度です');
    }
}
