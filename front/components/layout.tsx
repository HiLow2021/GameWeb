import { Environment } from '../shared/environment';
import SoundToggleButton from './soundToggleButton';

export const Layout = ({ children }: { children: React.ReactNode }): JSX.Element => {
    return (
        <>
            <header className="h-18 top-0 flex items-center justify-center bg-black p-3 text-gray-300">
                <p className="text-center text-3xl sm:text-4xl">{Environment.siteTitle}</p>
                <div className="absolute left-4 sm:left-8">
                    <SoundToggleButton />
                </div>
            </header>
            <main className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-grow p-4">
                <div className="w-full py-4 px-8">{children}</div>
            </main>
            <footer className="bottom-0 h-12 bg-black p-3 text-gray-300">
                <p className="text-center">{Environment.siteCopyright}</p>
            </footer>
        </>
    );
};
