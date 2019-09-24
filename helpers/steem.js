/* eslint-disable import/prefer-default-export */
import steem from 'steem';

export const getAccount = username => {
  return steem.api.getAccountsAsync([username]).then(account => {
    if (account.length < 1) return { name: username };

    const { posting_json_metadata } = account[0];

    const json = JSON.parse(posting_json_metadata);
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
