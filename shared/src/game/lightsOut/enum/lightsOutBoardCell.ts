export type LightsOutBoardCell = typeof LightsOutBoardCell[keyof typeof LightsOutBoardCell];

export const LightsOutBoardCell = {
    OutOfRange: 'outOfRange',
    On: 'on',
    Off: 'off'
} as const;
