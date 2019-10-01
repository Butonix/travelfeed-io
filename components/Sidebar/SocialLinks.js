import {
  faFacebookF,
  faInstagram,
  faPinterest,
  faTwitter,
  faYoutube,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import IconButton from '@material-ui/core/IconButton';
import React, { Fragment } from 'react';

const social = [
  {
    name: 'Facebook',
    link: 'https://www.facebook.com/travelfeedio',
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
    link: 'https://twitter.com/travelfeedio',
    icon: (
      <FontAwesomeIcon
        style={{ width: '22px', height: '22px' }}
        icon={faTwitter}
      />
    ),
  },
  {
    name: 'Instagram',
    link: 'https://www.instagram.com/travelfeed.io/',
    icon: (
      <FontAwesomeIcon
        style={{ width: '22px', height: '22px' }}
        icon={faInstagram}
      />
    ),
  },
  {
    name: 'Youtube',
    link: 'https://www.youtube.com/channel/UCy2nXX5orB6sBBpA-oRXTuw',
    icon: (
      <FontAwesomeIcon
        style={{ width: '22px', height: '22px' }}
        icon={faYoutube}
      />
    ),
  },
  {
    name: 'Pinterest',
    link: 'https://www.pinterest.com/travelfeedio/',
    icon: (
      <FontAwesomeIcon
        style={{ width: '22px', height: '22px' }}
        icon={faPinterest}
      />
    ),
  },
];

const SocialLinks = () => {
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

export default SocialLinks;
