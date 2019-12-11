import CardHeader from '@material-ui/core/CardHeader';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import ProfileAvatar from '../Profile/ProfileAvatar';
import ProfileName from '../Profile/ProfileName';
import DotMenu from './DotMenu';
import SubHeader from './SubHeader';

const PostContent = props => {
  // Prevent SSR
  return (
    <Fragment>
      <CardHeader
        avatar={
          <ProfileAvatar
            authorAvatar={props.authorAvatar}
            author={props.author}
          />
        }
        action={
          <Fragment>
            {!props.authorNotClickable && (
              <DotMenu
                author={props.author}
                permlink={props.permlink}
                title={props.title}
                img_url={props.img_url}
                tags={props.tags}
              />
            )}
          </Fragment>
        }
        title={
          <ProfileName
            author={props.author}
            displayName={props.display_name}
            authorNotClickable={props.authorNotClickable}
          />
        }
        subheader={
          <SubHeader
            created_at={props.created_at ? String(props.created_at) : undefined}
            readtime={props.readtime}
            location={{
              country_code: props.country_code,
              subdivision: props.subdivision,
            }}
            tags={props.tags}
            isTf={props.isTf}
            curationScore={props.curationScore}
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
  hideAuthorProfile: PropTypes.bool,
};

export default PostContent;
