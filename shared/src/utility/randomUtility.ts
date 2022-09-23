export class RandomUtility {
    public static random(min: number, max: number): number {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min) + min);
    }

    public static shuffle<T>(source: T[]): T[] {
        const result = [...source];
        for (let i = source.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [source[i], source[j]] = [source[j], source[i]];
        }

        return result;
    }
}
