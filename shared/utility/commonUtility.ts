export class CommonUtility {
    public static create2Array<T>(size: number): T[][] {
        const board = new Array(size);
        for (let index = 0; index < size; index++) {
            board[index] = new Array(size);
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
