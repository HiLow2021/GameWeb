const withTM = require('next-transpile-modules')(['shared']);

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    output: 'standalone'
};

module.exports = withTM(nextConfig);
