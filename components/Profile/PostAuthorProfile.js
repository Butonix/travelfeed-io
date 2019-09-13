import Typography from '@material-ui/core/Typography';
import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import { GET_SHORT_PROFILE } from '../../helpers/graphql/profile';
import Link from '../../lib/Link';
import FollowButton from './FollowButton';

const PostAuthorProfile = props => {
  return (
    <Fragment>
      <Query query={GET_SHORT_PROFILE} variables={props}>
        {({ data, loading, error }) => {
          if (loading || error || data.post === null) {
            return <Fragment />;
          }
          return (
            <div className="text-center">
              <Typography variant="h5" className="p-2">
                Written by:
              </Typography>
              <div className="pb-2">
                <Link
                  color="textPrimary"
                  as={`/@${data.profile.name}`}
                  href={`/blog?author=${data.profile.name}`}
                  passHref
                >
                  <a>
                    <img
                      style={{ cursor: 'pointer' }}
                      src={`https://steemitimages.com/u/${data.profile.name}/avatar/medium`}
                      alt={data.profile.name}
                      width="80"
                      height="80"
                      className="rounded-circle"
                    />
                  </a>
                </Link>
              </div>
              <Fragment>
                <div>
                  <Link
                    color="textPrimary"
                    as={`/@${data.profile.name}`}
                    href={`/blog?author=${data.profile.name}`}
                    passHref
                  >
                    <a>
                      <Typography variant="h6" className="textPrimary cpointer">
                        {data.profile.display_name}
                      </Typography>
                      <Typography color="textSecondary" variant="subtitle">
                        @{data.profile.name}
                      </Typography>
                    </a>
                  </Link>
                  {data.profile.isCurator && (
                    <p className="h5 pt-1">
                      <span className="badge badge-success">Curator</span>
                    </p>
                  )}
                </div>
                <p className="p-2">{data.profile.about}</p>
              </Fragment>
              <div>
                <FollowButton author={data.profile.name} btnstyle="default" />
              </div>
            </div>
          );
        }}
      </Query>
    </Fragment>
  );
};

export default PostAuthorProfile;
