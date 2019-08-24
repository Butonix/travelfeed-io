const withCSS = require('@zeit/next-css');
const withOffline = require('next-offline');
const withImages = require('next-images');
// https://github.com/zeit/next-plugins/tree/master/packages/next-bundle-analyzer
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const {
  MAPBOX_TOKEN,
  GMAPS_API_KEY,
  RECAPTCHA_SITE_KEY,
  CLOUDINARY_CLOUD_NAME,
  ROOTURL,
  GRAPHQL_URL,
} = process.env;

module.exports = withImages(
  withOffline(
    withCSS(
      withBundleAnalyzer({
        webpack(config) {
          config.node = { fs: 'empty' };
          return config;
        },
        publicRuntimeConfig: {
          MAPBOX_TOKEN,
          GMAPS_API_KEY,
          RECAPTCHA_SITE_KEY,
          CLOUDINARY_CLOUD_NAME,
          ROOTURL,
          GRAPHQL_URL,
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
