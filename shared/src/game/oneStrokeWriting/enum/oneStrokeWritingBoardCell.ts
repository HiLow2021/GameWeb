export type OneStrokeWritingBoardCell = typeof OneStrokeWritingBoardCell[keyof typeof OneStrokeWritingBoardCell];

export const OneStrokeWritingBoardCell = {
    OutOfRange: 'outOfRange',
    On: 'on',
    Off: 'off',
    Block: 'block'
} as const;
