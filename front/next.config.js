// eslint-disable-next-line @typescript-eslint/no-var-requires
const withTM = require('next-transpile-modules')(['shared']);

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: 'standalone',
    env: {
        BASE_URL: process.env.BASE_URL || ''
    }
};

module.exports = withTM(nextConfig);
