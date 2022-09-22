import dynamic from 'next/dynamic';
import { useLayoutEffect, useMemo, useState } from 'react';
import { detectWindowSize } from '../shared/windowUtility';

const GameProvider = ({ componentName }: { componentName: string }): JSX.Element => {
    const { width } = detectWindowSize();
    const conditionWidth = 640;
    const componentWidth = width == undefined || width >= conditionWidth ? 600 : 320;
    const componentHeight = width == undefined || width >= conditionWidth ? 600 : 320;

    const [currentWidth, setCurrentWidth] = useState(width);
    const [widthStateChange, setWidthStateChange] = useState(true);

    const detectWidthStateChange = (): boolean => {
        if (!width || !currentWidth) {
            return false;
        }
        if (width >= conditionWidth && currentWidth < conditionWidth) {
            return true;
        }
        if (width < conditionWidth && currentWidth >= conditionWidth) {
            return true;
        }

        return false;
    };

    // konva が ES Module に対応していないことによるエラーの対応処置。
    // https://qiita.com/koji-koji/items/6b71c1579e1a77d44b4b
    const GameComponent = dynamic<{ width: number; height: number }>(() => import(`./${componentName}`), {
        ssr: false
    });

    // 幅が特定の閾値を超えて変化した場合のみ再レンダリングしたいためのメモ化処置。
    const GameComponentMemo = useMemo(() => GameComponent, [widthStateChange]);

    useLayoutEffect(() => {
        if (detectWidthStateChange()) {
            setWidthStateChange((prev) => !prev);
        }

        setCurrentWidth(() => width);
    }, [width]);

    return (
        <div className="flex justify-center">
            <GameComponentMemo width={componentWidth} height={componentHeight} />
        </div>
    );
};

export default GameProvider;
