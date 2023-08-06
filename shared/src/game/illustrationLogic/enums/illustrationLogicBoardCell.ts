export type IllustrationLogicBoardCell = typeof IllustrationLogicBoardCell[keyof typeof IllustrationLogicBoardCell];

export const IllustrationLogicBoardCell = {
    OutOfRange: 'outOfRange',
    On: 'on',
    Off: 'off',
    Mark: 'mark'
} as const;
