/* eslint-disable prefer-destructuring */
// Do not use destructuring!
// https://github.com/zeit/next.js/tree/master#build-time-configuration

export const MAPBOX_TOKEN = process.env.MAPBOX_TOKEN;
export const GMAPS_API_KEY = process.env.GMAPS_API_KEY;
export const RECAPTCHA_SITE_KEY = process.env.RECAPTCHA_SITE_KEY;
export const ROOTURL = process.env.ROOTURL;
export const GRAPHQL_URL = process.env.GRAPHQL_URL;
export const STEEM_API = process.env.STEEM_API;

export const STEEMCONNECT_CALLBACK_URL = `${ROOTURL}/login`;

export const APP_VERSION = 'travelfeed/2.0.0';
export const DEFAULT_META_DESCRIPTION =
  'Find inspiration for your travels on TravelFeed. Join the TravelFeed community, write your own travel blog and start earning!';
