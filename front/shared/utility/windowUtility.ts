import { useEffect, useLayoutEffect, useState } from 'react';

type WindowSize = { width?: number; height?: number };

export const detectWindowSize = (): WindowSize => {
    const [windowSize, setWindowSize] = useState<WindowSize>({ width: undefined, height: undefined });
    const useSync = typeof window !== 'undefined';

    const effectCallback = () => {
        if (typeof window !== 'undefined') {
            const handleResize = () => {
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight
                });
            };

            window.addEventListener('resize', handleResize);
            handleResize();

            return () => window.removeEventListener('resize', handleResize);
        }
    };

    if (useSync) {
        useLayoutEffect(effectCallback, []);
    } else {
        useEffect(effectCallback, []);
    }

    return windowSize;
};
