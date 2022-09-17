export class CommonUtility {
    public static delay(milliSeconds: number): Promise<void> {
        return new Promise((res) => setTimeout(res, milliSeconds));
    }
}
