import React from 'react';
import Link from '../../lib/Link';

const SliderTags = props => {
  const { tags, classes, sliderstyle } = props;
  const tfInTags = tags.indexOf('travelfeed');
  if (tfInTags !== -1) delete tags[tfInTags];

  return (
    <>
      <div className={classes}>
        {tags.map(tag => {
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
