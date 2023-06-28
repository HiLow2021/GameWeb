import { useRouter } from 'next/router';
import { useEffect } from 'react';

export type Event = {
    action: string;
    category: string;
    label: string;
};

export const googleSearchConsoleId = process.env.GOOGLE_SEARCH_CONSOLE_ID || '';
export const existsGoogleSearchConsoleId = googleSearchConsoleId !== '';

export const googleAnalyticsTrackingId = process.env.GOOGLE_ANALYTICS_TRACKING_ID || '';
export const existsGoogleAnalyticsTrackingId = googleAnalyticsTrackingId !== '';

export const invokeEventTrackingTag = ({ action, category, label }: Event) => {
    if (!existsGoogleAnalyticsTrackingId) {
        return;
    }

    window.gtag('event', action, {
        event_category: category,
        event_label: label
    });
};

export const invokePageView = (path: string) => {
    if (!existsGoogleAnalyticsTrackingId) {
        return;
    }

    window.gtag('config', googleAnalyticsTrackingId, {
        page_path: path
    });
};

export const useInvokePageView = () => {
    const router = useRouter();

    useEffect(() => {
        if (!existsGoogleAnalyticsTrackingId) {
            return;
        }

        const handleRouteChange = (path: string) => {
            invokePageView(path);
        };

        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events]);
};
