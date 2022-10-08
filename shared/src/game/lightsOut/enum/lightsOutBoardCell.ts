export type LightsOutBoardCell = 'outOfRange' | 'on' | 'off';

export const LightsOutBoardCell = {
    outOfRange: 'outOfRange',
    on: 'on',
    off: 'off'
} as const;
