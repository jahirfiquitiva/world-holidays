/* eslint-disable @typescript-eslint/no-var-requires */
// const withPWA = require('next-pwa');
const nextTranslate = require('next-translate');

module.exports = nextTranslate({
  swcMinify: true,
  reactStrictMode: true,
  images: {
    domains: ['source.unsplash.com', 'images.unsplash.com'],
  },
  webpack(config, { dev, isServer }) {
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
      });
    }
    return config;
  },
});
