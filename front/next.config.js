// eslint-disable-next-line @typescript-eslint/no-var-requires
const withTM = require('next-transpile-modules')(['shared']);

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: 'standalone',
    env: {
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
        NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_ID: process.env.NEXT_PUBLIC_GOOGLE_SEARCH_CONSOLE_ID || '',
        NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID || ''
    }
};

module.exports = withTM(nextConfig);
