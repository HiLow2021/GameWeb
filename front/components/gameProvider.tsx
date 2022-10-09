import dynamic from 'next/dynamic';

const GameProvider = ({ componentName }: { componentName: string }): JSX.Element => {
    // konva が ES Module に対応していないことによるエラーの対応処置。
    // https://qiita.com/koji-koji/items/6b71c1579e1a77d44b4b
    const GameComponent = dynamic(() => import(`./game/${componentName}`), {
        ssr: false
    });

    return (
        <div className="flex justify-center">
            <GameComponent />
        </div>
    );
};

export default GameProvider;
