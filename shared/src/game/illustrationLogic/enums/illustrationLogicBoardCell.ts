export type IllustrationLogicBoardCell = typeof IllustrationLogicBoardCell[keyof typeof IllustrationLogicBoardCell];

export const IllustrationLogicBoardCell = {
    outOfRange: 'outOfRange',
    on: 'on',
    off: 'off',
    mark: 'mark'
} as const;
