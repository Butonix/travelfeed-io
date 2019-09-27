import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import CuratorMenu from '../CuratorMenu/PostMenu';
import PostMap from '../Maps/PostMap';
import PostAuthorProfile from '../Profile/PostAuthorProfile';
import ProfileAvatar from '../Profile/ProfileAvatar';
import ProfileName from '../Profile/ProfileName';
import SubHeader from './SubHeader';

const PostContent = props => {
  // Prevent SSR
  const BookmarkIcon = dynamic(() => import('./BookmarkIcon'), {
    ssr: false,
  });

  return (
    <Fragment>
      <CardHeader
        avatar={<ProfileAvatar author={props.author} />}
        action={
          <Fragment>
            <span>{props.appIcon}</span>
            <BookmarkIcon author={props.author} permlink={props.permlink} />
            <CuratorMenu
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
      <CardContent>
        {props.content}
        {props.latitude && (
          <div className="fullwidth">
            <hr />
            <div className="text-center">
              <Typography variant="h5" className="p-2" gutterBottom>
                Post Location
              </Typography>
            </div>
            <PostMap
              location={{
                coordinates: {
                  lat: props.latitude,
                  lng: props.longitude,
                },
              }}
            />
          </div>
        )}
        {!props.hideAuthorProfile && (
          <>
            <hr />
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-6 col-md-9 col-sm12">
                  <div className="text-center">
                    <Typography
                      variant="h5"
                      className="p-2 text-center"
                      gutterBottom
                    >
                      Written by
                    </Typography>
                    <PostAuthorProfile author={props.author} />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
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
