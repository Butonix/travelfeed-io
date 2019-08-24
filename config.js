import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const {
  MAPBOX_TOKEN,
  GMAPS_API_KEY,
  RECAPTCHA_SITE_KEY,
  CLOUDINARY_CLOUD_NAME,
  ROOTURL,
  GRAPHQL_URL,
} = publicRuntimeConfig;

export const STEEMCONNECT_CALLBACK_URL = `${ROOTURL}/login`;

export const APP_VERSION = 'travelfeed/1.3.0';
export const DEFAULT_META_DESCRIPTION =
  'Find inspiration for your travels on TravelFeed. Join the TravelFeed community, write your own travel blog and start earning!';
