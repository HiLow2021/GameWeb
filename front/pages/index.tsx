import type { NextPage } from 'next';
import Link from 'next/link';
import { Layout } from '../components/layout';
import { GameList } from '../shared/game/gameList';

const Index: NextPage = (): JSX.Element => {
    return (
        <Layout>
            <div className="flex justify-center gap-8">
                {GameList.map((game) => (
                    <Link href={game.path}>
                        <a>
                            <div className="flex flex-col">
                                <img className="h-48 w-48 object-scale-down" src={game.thumbnail} alt={game.title} />
                                <div className="p-4 text-center text-xl">{game.title}</div>
                            </div>
                        </a>
                    </Link>
                ))}
            </div>
        </Layout>
    );
};

export default Index;
