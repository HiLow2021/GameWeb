import { Environment } from '../shared/environment';

export const Layout = ({ children }: { children: React.ReactNode }): JSX.Element => {
    return (
        <>
            <header className="h-18 top-0 bg-black p-3 text-gray-300">
                <p className="text-center text-4xl">{Environment.siteTitle}</p>
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
