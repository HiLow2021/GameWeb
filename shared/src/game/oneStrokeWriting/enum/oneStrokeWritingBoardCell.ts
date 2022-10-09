export type OneStrokeWritingBoardCell = 'outOfRange' | 'on' | 'off' | 'block';

export const OneStrokeWritingBoardCell = {
    outOfRange: 'outOfRange',
    on: 'on',
    off: 'off',
    block: 'block'
} as const;
