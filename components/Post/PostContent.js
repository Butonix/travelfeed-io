import CardHeader from '@material-ui/core/CardHeader';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import PostMenu from '../CuratorMenu/PostMenu';
import ProfileAvatar from '../Profile/ProfileAvatar';
import ProfileName from '../Profile/ProfileName';
import SubHeader from './SubHeader';

const PostContent = props => {
  // Prevent SSR
  return (
    <Fragment>
      <CardHeader
        avatar={<ProfileAvatar author={props.author} />}
        action={
          <Fragment>
            <span>{props.appIcon}</span>
            <PostMenu
              author={props.author}
              permlink={props.permlink}
              isTf={props.isTf}
            />
          </Fragment>
        }
        title={
          <ProfileName author={props.author} displayName={props.display_name} />
        }
        subheader={
          <SubHeader
            created_at={props.created_at ? String(props.created_at) : undefined}
            readtime={props.readtime}
          />
        }
      />
      {props.content}
    </Fragment>
  );
};

PostContent.defaultProps = {
  hideAuthorProfile: false,
};

PostContent.propTypes = {
  author: PropTypes.string.isRequired,
  permlink: PropTypes.string.isRequired,
  display_name: PropTypes.string.isRequired,
  created_at: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  readtime: PropTypes.objectOf(PropTypes.any).isRequired,
  appIcon: PropTypes.func.isRequired,
  hideAuthorProfile: PropTypes.bool,
};

export default PostContent;
