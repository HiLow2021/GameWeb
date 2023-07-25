import { ArrayUtility } from './arrayUtility';

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

    public static rotate<T>(source: T[][]): T[][] {
        const result = ArrayUtility.create2Array<T>(source[0].length, source.length);
        ArrayUtility.copy2Array(source, result);

        const rotate = RandomUtility.random(0, 4);
        switch (rotate) {
            case 0:
                return ArrayUtility.rotate90(result);

            case 1:
                return ArrayUtility.rotate180(result);

            case 2:
                return ArrayUtility.rotate270(result);

            default:
                return result;
        }
    }

    public static transpose<T>(source: T[][]): T[][] {
        const result = ArrayUtility.create2Array<T>(source[0].length, source.length);
        ArrayUtility.copy2Array(source, result);

        const transpose = RandomUtility.random(0, 2);
        switch (transpose) {
            case 0:
                return ArrayUtility.transpose(result);

            default:
                return result;
        }
    }

    public static transformation<T>(source: T[][]): T[][] {
        return this.transpose(this.rotate(source));
    }
}
