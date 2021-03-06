/* eslint-disable import/no-extraneous-dependencies */
const withOffline = require('next-offline');
const withImages = require('next-images');
// https://github.com/zeit/next-plugins/tree/master/packages/next-bundle-analyzer
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
// Add push listener to next-offline service worker
// https://github.com/hanford/next-offline/issues/35#issuecomment-415367268
const withCSS = require('@zeit/next-css');

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require
  require('dotenv').config();
}

module.exports = withImages(
  withOffline(
    withCSS(
      withBundleAnalyzer({
        webpack(config) {
          // eslint-disable-next-line no-param-reassign
          config.node = { fs: 'empty' };
          return config;
        },
        env: {
          MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
          GMAPS_API_KEY: process.env.GMAPS_API_KEY,
          RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
          ROOTURL: process.env.ROOTURL,
          GRAPHQL_URL: process.env.GRAPHQL_URL,
          WEB_PUSH_PUB: process.env.WEB_PUSH_PUB,
          STEEM_API: process.env.STEEM_API,
        },
        analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
        analyzeBrowser: ['browser', 'both'].includes(
          process.env.BUNDLE_ANALYZE,
        ),
        bundleAnalyzerConfig: {
          server: {
            analyzerMode: 'static',
            reportFilename: '../bundles/server.html',
          },
          browser: {
            analyzerMode: 'static',
            reportFilename: '../bundles/client.html',
          },
        },
        dontAutoRegisterSw: true,
        workboxOpts: {
          swDest: 'static/service-worker.js',
          runtimeCaching: [
            {
              urlPattern: /^https?.*/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'offlineCache',
                expiration: {
                  maxEntries: 200,
                },
              },
            },
          ],
          importScripts: ['./scripts/sw-push-listener.js'],
        },
      }),
    ),
  ),
);
