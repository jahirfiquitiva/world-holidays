/* eslint-disable @typescript-eslint/no-var-requires */
// const withPWA = require('next-pwa');
const nextTranslate = require('next-translate');

module.exports = nextTranslate({
  reactStrictMode: true,
  images: {
    domains: ['source.unsplash.com'],
  },
});
