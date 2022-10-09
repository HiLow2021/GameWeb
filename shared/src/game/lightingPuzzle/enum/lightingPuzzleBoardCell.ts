export type LightingPuzzleBoardCell = 'outOfRange' | 'on' | 'off' | 'block';

export const LightingPuzzleBoardCell = {
    outOfRange: 'outOfRange',
    on: 'on',
    off: 'off',
    block: 'block'
} as const;
