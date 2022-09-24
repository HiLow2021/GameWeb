import { detectWindowSizeSync } from './windowUtility';

type ComponentSize = { width: number; height: number; small: boolean };

export const IsSmallSize = (): boolean => {
    const windowSize = detectWindowSizeSync();
    const conditionWidth = 640;

    return windowSize.width == undefined || windowSize.width < conditionWidth;
};

export const getGameComponentSize = (): ComponentSize => {
    const small = IsSmallSize();
    const width = small ? 320 : 600;
    const height = small ? 320 : 600;

    return { width, height, small };
};

export const getSvgSize = (): ComponentSize => {
    const small = IsSmallSize();
    const width = small ? 36 : 48;
    const height = small ? 36 : 48;

    return { width, height, small };
};
