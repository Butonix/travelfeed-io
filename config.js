// The API keys in this file are used client-side and restricted to
// travelfeed.io, so don't bother trying to steal them ;)

// Prduction settings. TODO: Add next.js equivalent of dotenv for localhost keys
//  (local development)
export const GMAPS_API_KEY = 'AIzaSyCPxDdLuLnseopR4g3ClB2PvsZyiMBjS7c';
export const RECAPTCHA_SITE_KEY = '6LcYarQUAAAAADqDyT5Y27mcWqNnXZLljW9b1Vss';
export const MAPBOX_TOKEN =
  'pk.eyJ1IjoidGlvdGRldiIsImEiOiJjanZ2NjVzdjQxZ3Q2M3ptczN5NTIwY3k4In0.ZIhYhbkfSAfbX11XDwI57w';

export const DEFAULT_IMAGE = '';
export const APP_VERSION = 'travelfeed/1.3.0';

let url = 'http://localhost:3000/login';
let rooturl = 'http://localhost:3000';

if (process.env.NODE_ENV === 'production') {
  url = 'https://travelfeed.io/login';
  rooturl = 'https://travelfeed.io';
}

export const GRAPHQL_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://api.travelfeed.io/graphql'
    : 'https://api.travelfeed.io/graphql';
// Enable for local API development
// : "http://localhost:4000/graphql";

export const STEEMCONNECT_CALLBACK_URL = url;
export const ROOTURL = rooturl;

export const DEFAULT_META_DESCRIPTION =
  'Find inspiration for your travels on TravelFeed. Join the TravelFeed community, write your own travel blog and start earning!';

// Cloudinary
export const CLOUDINARY_CLOUD_NAME = 'dmuksl47x';
