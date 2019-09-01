import {
  faFacebookF,
  faPinterest,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';
import React, { Fragment } from 'react';

const PostSocialShares = props => {
  const link = `https://travelfeed.io/@${props.author}/${props.permlink}`;
  let tags = '';
  props.tags.forEach((t, i) => {
    if (i > 0) tags += ',';
    tags += t;
  });

  const social = [
    {
      name: 'Facebook',
      link: `https://www.facebook.com/sharer.php?u=${encodeURIComponent(link)}`,
      icon: (
        <FontAwesomeIcon
          style={{ width: '22px', height: '22px' }}
          icon={faFacebookF}
          className="textPrimary"
        />
      ),
    },
    {
      name: 'Twitter',
      link: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        link,
      )}&text=${encodeURIComponent(props.title)}&hashtags=${encodeURIComponent(
        tags,
      )}`,
      icon: (
        <FontAwesomeIcon
          style={{ width: '22px', height: '22px' }}
          icon={faTwitter}
        />
      ),
    },
    {
      name: 'Pinterest',
      link: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
        link,
      )}&media=${encodeURIComponent(
        props.img_url,
      )}&description=${encodeURIComponent(props.title)}`,
      icon: (
        <FontAwesomeIcon
          style={{ width: '22px', height: '22px' }}
          icon={faPinterest}
        />
      ),
    },
  ];

  return (
    <Fragment>
      <div className="text-center">
        {social.map(s => {
          return (
            <a
              href={s.link}
              title={s.name}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              <IconButton>{s.icon}</IconButton>
            </a>
          );
        })}
      </div>
    </Fragment>
  );
};

export default PostSocialShares;
