export const DEFAULT_IMAGE = "";
export const APP_VERSION = "travelfeed/0.2";
export const GMAPS_JS_APIKEY = "AIzaSyCPxDdLuLnseopR4g3ClB2PvsZyiMBjS7c";

var url = "http://localhost:3000/dashboard/login";
var rooturl = "http://localhost:3000";
if (process.env.NODE_ENV == "production") {
  url = "https://travelfeed.io/dashboard/login";
  rooturl = "https://travelfeed.io";
}
export const STEEMCONNECT_CALLBACK_URL = url;
export const ROOTURL = rooturl;

export const DEFAULT_META_DESCRIPTION =
  "Find inspiration for your travels on TravelFeed. Join the TravelFeed community, write your own travel blog and start earning!";
