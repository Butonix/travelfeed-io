import React from 'react';
import cleanTags from '../../helpers/cleanTags';
import Link from '../../lib/Link';

const SliderTags = props => {
  const { tags, classes, sliderstyle, cutTags } = props;

  let taglist = tags;
  if (cutTags) taglist = cleanTags(tags, { cutTags });

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
              >
                <span
                  className="badge badge-secondary m-1 p-1 pl-2 pr-2 rounded"
                  style={sliderstyle}
                >
                  {tag ? tag.toUpperCase() : 'TRAVELFEED'}
                </span>
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
