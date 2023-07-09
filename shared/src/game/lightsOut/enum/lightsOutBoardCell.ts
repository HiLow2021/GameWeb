export type LightsOutBoardCell = typeof LightsOutBoardCell[keyof typeof LightsOutBoardCell];

export const LightsOutBoardCell = {
    outOfRange: 'outOfRange',
    on: 'on',
    off: 'off'
} as const;
