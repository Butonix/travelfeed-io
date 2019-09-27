import Typography from '@material-ui/core/Typography';
import React from 'react';
import Link from '../../lib/Link';
import ProfilePopup from './ProfilePopup';

const ProfileName = props => {
  const { author, displayName } = props;

  return (
    <ProfilePopup
      author={author}
      component={
        <Link
          color="textPrimary"
          as={`/@${author}`}
          href={`/blog?author=${author}`}
          passHref
        >
          <a className="textPrimary cpointer hoverline">
            <strong>{displayName}</strong>
            <Typography
              color="textSecondary"
              variant="subtitle"
              display="inline"
            >
              {' '}
              @{author}
            </Typography>
          </a>
        </Link>
      }
    />
  );
};

export default ProfileName;
