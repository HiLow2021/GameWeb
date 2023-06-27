import Script from 'next/script';
import { existsGoogleAnalyticsTrackingId, googleAnalyticsTrackingId } from '../../shared/utility/googleUtility';

export const GoogleAnalytics = (): JSX.Element => (
    <>
        {existsGoogleAnalyticsTrackingId && (
            <>
                <Script
                    defer
                    src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsTrackingId}`}
                    strategy="afterInteractive"
                />
                <Script
                    defer
                    dangerouslySetInnerHTML={{
                        __html: `
                                  window.dataLayer = window.dataLayer || [];
                                  function gtag(){dataLayer.push(arguments);}
                                  gtag('js', new Date());    
                                  gtag('config', '${googleAnalyticsTrackingId}');
                                `
                    }}
                    strategy="afterInteractive"
                />
            </>
        )}
    </>
);
