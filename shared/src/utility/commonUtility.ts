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

    public static delay(milliSeconds: number): Promise<void> {
        return new Promise((res) => setTimeout(res, milliSeconds));
    }
}
