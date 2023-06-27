import { existsGoogleSearchConsoleId, googleSearchConsoleId } from '../../shared/utility/googleUtility';

export const GoogleSearchConsole = (): JSX.Element => (
    <>
        {existsGoogleSearchConsoleId && (
            <>
                <meta name="google-site-verification" content={googleSearchConsoleId} />
            </>
        )}
    </>
);
