import { Site } from '../shared/site';
import BackButton from './backButton';
import HomeButton from './homeButton';
import SoundToggleButton from './soundToggleButton';

export const Layout = ({ children, title, top }: { children: React.ReactNode; title: string; top: boolean }): JSX.Element => {
    return (
        <>
            <header className="h-18 top-0 flex items-center justify-center bg-black p-4 text-gray-300">
                <h1 className="text-center text-3xl sm:text-4xl">{title}</h1>
                <div className="absolute left-4 sm:left-8">
                    <>{top ? <HomeButton /> : <BackButton />}</>
                </div>
                <div className="absolute right-4 sm:right-8">
                    <SoundToggleButton />
                </div>
            </header>
            <main className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-grow p-4">
                <div className="w-full py-4 px-8">{children}</div>
            </main>
            <footer className="bottom-0 h-12 bg-black p-3 text-gray-300">
                <p className="text-center">{Site.copyright}</p>
            </footer>
        </>
    );
};
