import { Query } from '@apollo/react-components';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import React, { Fragment, useEffect, useState } from 'react';
import Img from 'react-image';
import { GET_SHORT_PROFILE } from '../../helpers/graphql/profile';
import { getAccount } from '../../helpers/steem';
import Link from '../../lib/Link';
import FollowButton from './FollowButton';

const PostAuthorProfile = props => {
  const [about, setAbout] = useState('');

  useEffect(() => {
    getAccount(props.author).then(profile => {
      if (profile.about) setAbout(profile.about);
    });
  }, []);

  return (
    <Fragment>
      <Query query={GET_SHORT_PROFILE} variables={props}>
        {({ data, loading, error }) => {
          if (loading || error || data.post === null) {
            return <Fragment />;
          }
          return (
            <div className="text-center">
              <div className="pb-2">
                <Link
                  color="textPrimary"
                  as={`/@${props.author}`}
                  href={`/blog?author=${props.author}`}
                >
                  <Img
                    style={{ cursor: 'pointer' }}
                    src={[
                      `https://steemitimages.com/u/${props.author}/avatar/medium`,
                      'https://steemitimages.com/p/7ohP4GDMGPrVF5MeU8t5EQqCvJfGAJHyAFuxrYFhqA4BPKCkPjVBef1jSt7fHRrXVXRuRKBksi1FSJnZL8Co9zi6CpbK1bmV2sFR?width=80&height=80',
                    ]}
                    alt={props.author}
                    width="80"
                    height="80"
                    className="rounded-circle"
                    loader={
                      <Skeleton
                        className="mx-auto"
                        variant="circle"
                        width={80}
                        height={80}
                      />
                    }
                  />
                </Link>
              </div>
              <Fragment>
                <div>
                  <Link
                    color="textPrimary"
                    as={`/@${props.author}`}
                    href={`/blog?author=${props.author}`}
                  >
                    <Typography variant="h6" className="textPrimary cpointer">
                      {props.display_name}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle">
                      @{props.author}
                    </Typography>
                  </Link>
                  {data.profile.isCurator && (
                    <p className="h5 pt-1">
                      <span className="badge badge-success">Curator</span>
                    </p>
                  )}
                </div>
                <p className="p-2">
                  {about || (
                    <>
                      <Skeleton
                        className="mx-auto"
                        variant="text"
                        width="80%"
                        height={20}
                      />
                      <Skeleton
                        className="mx-auto"
                        variant="text"
                        width="80%"
                        height={20}
                      />
                      <Skeleton
                        className="mx-auto"
                        variant="text"
                        width="80%"
                        height={20}
                      />
                    </>
                  )}
                </p>
              </Fragment>
              <div>
                <FollowButton author={props.author} btnstyle="default" />
              </div>
            </div>
          );
        }}
      </Query>
    </Fragment>
  );
};

export default PostAuthorProfile;
