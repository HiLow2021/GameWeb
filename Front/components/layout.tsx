export const Layout = ({ children }: { children: React.ReactNode }): JSX.Element => {
    return (
        <>
            <main className="mx-auto flex min-h-screen w-full max-w-screen-xl flex-grow p-4">
                <div className="w-full md:py-4 md:px-8">{children}</div>
            </main>
            <footer className=""></footer>
        </>
    );
};
