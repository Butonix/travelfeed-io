import Avatar from '@material-ui/core/Avatar';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import Link from '../../lib/Link';
import ProfilePopup from './ProfilePopup';

const useStyles = makeStyles(() => ({
  avatar: {
    paddingRight: 0,
  },
}));

const ProfileAvatar = props => {
  const classes = useStyles();

  const { author } = props;

  return (
    <>
      <ProfilePopup
        author={author}
        component={
          <Link
            color="textPrimary"
            as={`/@${author}`}
            href={`/blog?author=${author}`}
            passHref
          >
            <a>
              <Avatar
                className={classes.avatar}
                style={{ cursor: 'pointer' }}
                src={`https://steemitimages.com/u/${author}/avatar/small`}
                alt={author}
              />
            </a>
          </Link>
        }
      />
    </>
  );
};

export default ProfileAvatar;
