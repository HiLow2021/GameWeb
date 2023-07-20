export type NumberLinkBoardCellType = typeof NumberLinkBoardCellType[keyof typeof NumberLinkBoardCellType];

export const NumberLinkBoardCellType = {
    none: 'none',
    route: 'route',
    number: 'number'
} as const;
