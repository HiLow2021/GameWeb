import dynamic from 'next/dynamic';
import { detectWindowSize } from '../shared/windowUtility';

const GameProvider = ({ componentName }: { componentName: string }): JSX.Element => {
    const { width } = detectWindowSize();
    const componentWidth = width == undefined || width >= 640 ? 600 : 320;
    const componentHeight = width == undefined || width >= 640 ? 600 : 320;

    // konva が ES Module に対応していないことによるエラーの対応措置。
    // https://qiita.com/koji-koji/items/6b71c1579e1a77d44b4b
    const GameComponent = dynamic<{ width: number; height: number }>(() => import(`./${componentName}`), {
        ssr: false
    });

    return (
        <div className="flex justify-center">
            <GameComponent width={componentWidth} height={componentHeight} />
        </div>
    );
};

export default GameProvider;
