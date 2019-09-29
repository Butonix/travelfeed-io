import React from 'react';
import Link from '../../lib/Link';

const SliderTags = props => {
  const { tags, classes, sliderstyle, cutTags } = props;
  // remove 'travelfeed' from tags
  let taglist = tags.filter(item => {
    return item !== 'travelfeed';
  });
  // use only first tag for preview cards
  if (cutTags) taglist = [taglist[0]];

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
                    {tag.toUpperCase()}
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
