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

    public static delay(milliSeconds: number): Promise<void> {
        return new Promise((res) => setTimeout(res, milliSeconds));
    }
}
