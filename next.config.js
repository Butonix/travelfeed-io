const withCSS = require('@zeit/next-css');
const withOffline = require('next-offline');
const withImages = require('next-images');
// https://github.com/zeit/next-plugins/tree/master/packages/next-bundle-analyzer
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

module.exports = withImages(
  withOffline(
    withCSS(
      withBundleAnalyzer({
        webpack(config) {
          config.node = { fs: 'empty' };
          return config;
        },
        env: {
          MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
          GMAPS_API_KEY: process.env.GMAPS_API_KEY,
          RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
          ROOTURL: process.env.ROOTURL,
          GRAPHQL_URL: process.env.GRAPHQL_URL,
          NOTIFY_URL: process.env.NOTIFY_URL,
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
      }),
    ),
  ),
);
