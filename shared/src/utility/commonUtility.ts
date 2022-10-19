export class CommonUtility {
    public static clamp(value: number, min: number, max: number): number {
        if (value < min) {
            return min;
        } else if (value > max) {
            return max;
        } else {
            return value;
        }
    }

    public static create2Array<T>(width: number, height: number): T[][] {
        const board = new Array(height);
        for (let index = 0; index < height; index++) {
            board[index] = new Array(width);
        }

        return board;
    }

    public static copy2Array<T>(source: T[][], destination: T[][]): void {
        for (let y = 0; y < source.length; y++) {
            for (let x = 0; x < source[y].length; x++) {
                destination[y][x] = source[y][x];
            }
        }
    }

    public static rotate90<T>(source: T[][]): T[][] {
        const result = CommonUtility.create2Array<T>(source.length, source[0].length);
        for (let y = 0; y < result.length; y++) {
            for (let x = 0; x < result[y].length; x++) {
                result[y][result[y].length - 1 - x] = source[x][y];
            }
        }

        return result;
    }

    public static rotate180<T>(source: T[][]): T[][] {
        const result = CommonUtility.create2Array<T>(source[0].length, source.length);
        for (let y = 0; y < result.length; y++) {
            for (let x = 0; x < result[y].length; x++) {
                result[result.length - 1 - y][result[y].length - 1 - x] = source[y][x];
            }
        }

        return result;
    }

    public static rotate270<T>(source: T[][]): T[][] {
        const result = CommonUtility.create2Array<T>(source.length, source[0].length);
        for (let y = 0; y < result.length; y++) {
            for (let x = 0; x < result[y].length; x++) {
                result[result.length - 1 - y][x] = source[x][y];
            }
        }

        return result;
    }

    public static transpose<T>(source: T[][]): T[][] {
        const result = CommonUtility.create2Array<T>(source.length, source[0].length);
        for (let y = 0; y < result.length; y++) {
            for (let x = 0; x < result[y].length; x++) {
                result[y][x] = source[x][y];
            }
        }

        return result;
    }

    public static delay(milliSeconds: number): Promise<void> {
        return new Promise((res) => setTimeout(res, milliSeconds));
    }
}
