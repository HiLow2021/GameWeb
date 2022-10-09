import type { NextPage } from 'next';
import GameProvider from '../../components/gameProvider';
import { Layout } from '../../components/layout';

const Index: NextPage = (): JSX.Element => {
    return (
        <Layout>
            <GameProvider componentName="lightingPuzzle" />
        </Layout>
    );
};

export default Index;
