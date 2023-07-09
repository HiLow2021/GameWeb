export type OneStrokeWritingBoardCell = typeof OneStrokeWritingBoardCell[keyof typeof OneStrokeWritingBoardCell];

export const OneStrokeWritingBoardCell = {
    outOfRange: 'outOfRange',
    on: 'on',
    off: 'off',
    block: 'block'
} as const;
