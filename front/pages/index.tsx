import type { NextPage } from 'next';
import Link from 'next/link';
import { Layout } from '../components/layout';
import { GameList } from '../shared/game/gameList';
import { Site } from '../shared/site';

const Index: NextPage = (): JSX.Element => {
    return (
        <Layout title={Site.title} top={true}>
            <div className="flex justify-center">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-16 lg:grid-cols-3">
                    {GameList.map((game) => (
                        <Link key={game.title} href={game.path}>
                            <a>
                                <div className="flex flex-col items-center">
                                    <img className="h-36 w-36 object-scale-down sm:h-48 sm:w-48" src={game.thumbnail} alt={game.title} />
                                    <h2 className="p-4 text-center text-xl">{game.title}</h2>
                                </div>
                            </a>
                        </Link>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Index;
