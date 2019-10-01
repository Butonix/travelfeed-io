import { photoTags, removeTags } from '../config';

const cleanTags = (tags, options) => {
  if (!tags) return undefined;
  // Replace all photo tags with "photography"
  photoTags.forEach(i => {
    const index = tags.indexOf(i);
    if (index !== -1) {
      if (tags.indexOf(i) === -1) tags[index] = 'photography';
      else delete tags[index];
    }
  });
  // remove 'travelfeed' from tags
  let taglist = tags.filter(item => {
    // Tags on Steem are often advertising or generic,
    // tags on TravelFeed  are  for discovering post about specific topics,
    // generic tags like "travel" are useless.
    // Project/app tags are confusing for new users.
    // -> hide these tags
    return removeTags.indexOf(item) === -1;
  });
  // use only first tag for preview cards
  if (options && options.cutTags) taglist = [taglist[0]];
  if (!taglist || taglist.length < 1) taglist = ['travelfeed'];
  return taglist;
};

export default cleanTags;
