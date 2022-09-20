import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import GameProvider from '../../components/gameProvider';
import { Layout } from '../../components/layout';

const Index: NextPage = (): JSX.Element => {
    return (
        <Layout>
            <GameProvider gameComponentName='othello'/>
        </Layout>
    );
};

export default Index;
