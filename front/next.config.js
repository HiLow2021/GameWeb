// eslint-disable-next-line @typescript-eslint/no-var-requires
const withTM = require('next-transpile-modules')(['shared']);

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: 'standalone',
    env: {
        API_URL: process.env.API_URL || '',
        GOOGLE_SEARCH_CONSOLE_ID: process.env.GOOGLE_SEARCH_CONSOLE_ID || '',
        GOOGLE_ANALYTICS_TRACKING_ID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || ''
    }
};

module.exports = withTM(nextConfig);
