/* eslint-disable import/prefer-default-export */
import steem from 'steem';
import { STEEM_API } from '../config';

steem.api.setOptions({ url: STEEM_API });

export const getAccount = username => {
  return steem.api.getAccountsAsync([username]).then(account => {
    if (account.length < 1) return { name: username };

    const { posting_json_metadata, json_metadata } = account[0];

    let json = {};
    try {
      json = JSON.parse(posting_json_metadata);
    } catch {
      try {
        json = JSON.parse(json_metadata);
      } catch {
        return { name: username };
      }
    }
    const { profile } = json;
    const {
      name,
      profile_image,
      cover_image,
      about,
      location,
      website,
      twitter,
      facebook,
      instagram,
      youtube,
      couchsurfing,
      pinterest,
    } = profile;

    return {
      name: username,
      display_name: name || username,
      profile_image,
      cover_image,
      about,
      location,
      website,
      twitter,
      facebook,
      instagram,
      youtube,
      couchsurfing,
      pinterest,
    };
  });
};

export default steem;
