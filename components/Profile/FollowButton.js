// no ssr since current user is essential to determine follow status

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import { Query } from 'react-apollo';
import { follow, unfollow } from '../../helpers/actions';
import { FOLLOW, UNFOLLOW } from '../../helpers/graphql/broadcast';
import { GET_IS_FOLLOWED } from '../../helpers/graphql/profile';
import graphQLClient from '../../helpers/graphQLClient';
import { getRoles } from '../../helpers/token';
import Link from '../../lib/Link';

const FollowButton = props => {
  const [isFollowed, setFollowed] = useState(undefined);
  const [isMounted, setMounted] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const newNotification = notification => {
    if (notification !== undefined) {
      let variant = 'success';
      if (notification.success === false) {
        variant = 'error';
      }
      const { enqueueSnackbar } = props;
      enqueueSnackbar(notification.message, { variant });
    }
  };

  const pastBroadcast = res => {
    setChanging(false);
    if (!res.success) newNotification(res);
    else setFollowed(!isFollowed);
  };

  const toggleFollowAuthor = () => {
    setChanging(true);
    const roles = getRoles();
    if (roles && roles.indexOf('easylogin') !== -1) {
      const variables = { following: props.author };
      graphQLClient(isFollowed ? UNFOLLOW : FOLLOW, variables).then(res => {
        if (res && (res.follow || res.unfollow)) {
          pastBroadcast(res.follow || res.unfollow);
        }
      });
    } else {
      // eslint-disable-next-line no-lonely-if
      if (isFollowed) {
        unfollow(props.author).then(res => {
          if (res) pastBroadcast(res);
        });
      } else {
        follow(props.author).then(res => {
          if (res) pastBroadcast(res);
        });
      }
    }
  };

  if (isMounted === false) {
    return <Fragment />;
  }
  let btnclass = 'm-1';
  if (props.btnstyle === 'whiteborder') {
    btnclass = 'm-1 border-light';
  }
  const variant = props.btnstyle === 'solid' ? 'contained' : 'outlined';
  const color = props.btnstyle === 'solid' ? 'primary' : 'inherit';

  return (
    <Fragment>
      <Query
        fetchPolicy="network-only"
        query={GET_IS_FOLLOWED}
        variables={{ author: props.author }}
      >
        {({ data, loading, error }) => {
          if (loading || error || data.profile === null) {
            return <Fragment />;
          }
          if (data && data.profile && !isLoaded) {
            setFollowed(data.profile.isFollowed);
            setLoaded(true);
          }
          return (
            <>
              {(isFollowed !== undefined && (
                <Fragment>
                  <Button
                    style={(changing && { opacity: 0.8 }) || {}}
                    variant={variant}
                    size="small"
                    color={color}
                    onClick={() => toggleFollowAuthor(props.author)}
                    className={btnclass}
                  >
                    {isFollowed ? 'Unfollow' : 'Follow'}
                    {changing && (
                      <CircularProgress
                        color="secondary"
                        className="ml-2"
                        value={changing}
                        size={24}
                      />
                    )}
                  </Button>
                </Fragment>
              )) || (
                <Link color="textPrimary" href="/join" passHref>
                  <Button
                    variant={variant}
                    size="small"
                    color={color}
                    className={btnclass}
                  >
                    Log in to follow
                  </Button>
                </Link>
              )}
            </>
          );
        }}
      </Query>
    </Fragment>
  );
};

FollowButton.defaultProps = {
  btnstyle: 'default',
};

FollowButton.propTypes = {
  author: PropTypes.string.isRequired,
  btnstyle: PropTypes.string,
  enqueueSnackbar: PropTypes.func.isRequired,
};

export default withSnackbar(FollowButton);
