import React from 'react';
import { photoTags, removeTags } from '../../config';
import Link from '../../lib/Link';

const SliderTags = props => {
  const { tags, classes, sliderstyle, cutTags } = props;
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
  if (cutTags) taglist = [taglist[0]];
  if (!taglist || taglist.length < 1) taglist = ['travelfeed'];

  return (
    <>
      <div className={classes}>
        {taglist &&
          taglist.map(tag => {
            return (
              <Link
                color="textPrimary"
                as={`/favorites/${tag}`}
                href={`/tag?orderby=total_votes&tags=${tag}`}
                key={tag}
                passHref
              >
                <a>
                  <span
                    className="badge badge-secondary m-1 p-1 pl-2 pr-2 rounded"
                    style={sliderstyle}
                  >
                    {tag ? tag.toUpperCase() : 'TRAVELFEED'}
                  </span>
                </a>
              </Link>
            );
          })}
      </div>
      <style>{`
      @media (min-width: 768px) {
      .taglist { text-align: right}
      }
      `}</style>
    </>
  );
};

export default SliderTags;
