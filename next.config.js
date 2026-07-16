/* eslint-disable @typescript-eslint/no-var-requires */
// const withPWA = require('next-pwa');
const nextTranslate = require('next-translate-plugin');

module.exports = nextTranslate(
  {
    reactCompiler: true,
    reactStrictMode: true,
    images: {
      remotePatterns: [
        { protocol: 'https', hostname: 'source.unsplash.com' },
        { protocol: 'https', hostname: 'images.unsplash.com' },
      ],
    },
    // turbopack: {
    //   resolveAlias: {
    //     // Swap React for Preact only in the browser bundle. The server keeps
    //     // real React so Next.js SSR / getStaticProps keep working.
    //     react: { browser: 'preact/compat' },
    //     'react-dom/test-utils': { browser: 'preact/test-utils' },
    //     'react-dom': { browser: 'preact/compat' },
    //   },
    // },
  },
  { turbopack: true },
);
