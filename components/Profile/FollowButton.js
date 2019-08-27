// no ssr since current user is essential to determine follow status

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import { Mutation, Query } from 'react-apollo';
import { follow, unfollow } from '../../helpers/actions';
import { FOLLOW, UNFOLLOW } from '../../helpers/graphql/broadcast';
import { GET_IS_FOLLOWED } from '../../helpers/graphql/profile';
import { getRoles } from '../../helpers/token';
import Link from '../../lib/Link';

const FollowButton = props => {
  const [mutate, setMutate] = useState(false);
  const [isFollowed, setFollowed] = useState(undefined);
  const [isMounted, setMounted] = useState(false);
  const [isLoaded, setLoaded] = useState(false);
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    setFollowed(props.isFollowed);
    setMounted(true);
  }, [props]);

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

  const followAuthor = () => {
    setChanging(true);
    const roles = getRoles();
    if (roles && roles.indexOf('easylogin') !== -1) {
      setMutate(true);
    } else {
      follow(props.author).then(res => {
        if (res) pastBroadcast(res);
      });
    }
  };

  const unfollowAuthor = () => {
    setChanging(true);
    const roles = getRoles();
    if (roles && roles.indexOf('easylogin') !== -1) {
      setMutate(true);
    } else {
      unfollow(props.author).then(res => {
        if (res) pastBroadcast(res);
      });
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
      <Query query={GET_IS_FOLLOWED} variables={{ author: props.author }}>
        {({ data, loading, error }) => {
          if (loading || error || data.profile === null) {
            return <Fragment />;
          }
          if (data && data.profile && !isLoaded) {
            setLoaded(true);
          }
          return (
            <Mutation
              mutation={isFollowed ? UNFOLLOW : FOLLOW}
              variables={{
                following: props.author,
              }}
            >
              {(triggerBroadcast, { data: mutdata }) => {
                if (mutate) {
                  triggerBroadcast();
                  setMutate(false);
                }
                if (
                  changing &&
                  mutdata &&
                  (mutdata.follow || mutdata.unfollow)
                ) {
                  pastBroadcast(mutdata.follow || mutdata.unfollow);
                }
                return (
                  <>
                    {(isFollowed === true && (
                      <Fragment>
                        <Button
                          style={(changing && { opacity: 0.2 }) || {}}
                          variant={variant}
                          size="small"
                          color={color}
                          onClick={() => unfollowAuthor(props.author)}
                          className={btnclass}
                        >
                          Unfollow
                        </Button>
                        {changing && (
                          <CircularProgress
                            className="ml-2"
                            value={changing}
                            size={24}
                          />
                        )}
                      </Fragment>
                    )) ||
                      ((isFollowed === false && (
                        <Fragment>
                          <Button
                            style={(changing && { opacity: 0.2 }) || {}}
                            variant={variant}
                            size="small"
                            color={color}
                            onClick={() => followAuthor(props.author)}
                            className={btnclass}
                          >
                            Follow
                          </Button>
                          {changing && (
                            <CircularProgress
                              className="ml-2"
                              value={changing}
                              size={24}
                            />
                          )}
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
                      ))}
                  </>
                );
              }}
            </Mutation>
          );
        }}
      </Query>
    </Fragment>
  );
};

FollowButton.defaultProps = {
  btnstyle: 'default',
  isFollowed: false,
};

FollowButton.propTypes = {
  author: PropTypes.string.isRequired,
  btnstyle: PropTypes.string,
  enqueueSnackbar: PropTypes.func.isRequired,
  isFollowed: PropTypes.bool,
};

export default withSnackbar(FollowButton);
