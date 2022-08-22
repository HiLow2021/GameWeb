import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Layout } from '../components/layout';

// konva が ES Module に対応していないことによるエラーの対応措置。
// https://qiita.com/koji-koji/items/6b71c1579e1a77d44b4b 
const Othello = dynamic(() => import('../components/othello'), {
    ssr: false
});

const Index: NextPage = (): JSX.Element => {
    return (
        <Layout>
            <div className="flex justify-center">
                <Othello width={600} height={600} />
            </div>
        </Layout>
    );
};

export default Index;
