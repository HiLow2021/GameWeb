import { detectWindowSizeSync } from './windowUtility';

type ComponentSize = { width: number; height: number; small: boolean };

export const getComponentSize = (): ComponentSize => {
    const windowSize = detectWindowSizeSync();

    const conditionWidth = 640;
    const small = windowSize.width == undefined || windowSize.width < conditionWidth;
    const width = small ? 320 : 600;
    const height = small ? 320 : 600;

    return { width, height, small };
};
