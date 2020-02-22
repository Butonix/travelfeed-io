/* eslint-disable import/no-cycle */
// no ssr since current user is essential to determine follow status

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import FollowIcon from '@material-ui/icons/PersonAdd';
import UnfollowIcon from '@material-ui/icons/PersonAddDisabled';
import Skeleton from '@material-ui/lab/Skeleton';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import { customJson, follow, unfollow } from '../../helpers/actions';
import { FOLLOW } from '../../helpers/graphql/broadcast';
import { GET_IS_FOLLOWED } from '../../helpers/graphql/profile';
import graphQLClient from '../../helpers/graphQLClient';
import { getRoles, getUser } from '../../helpers/token';
import LoginButton from '../Header/LoginButton';

const FollowButton = props => {
  const { community } = props;

  const [isFollowed, setFollowed] = useState(undefined);
  const [changing, setChanging] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    graphQLClient(GET_IS_FOLLOWED, {
      author: props.author,
      community: props.community,
    }).then(res => {
      setFollowed(res.isFollowed);
    });
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

  const callApi = broadcast => {
    const variables = {
      author: props.author,
      community,
      broadcast,
      isFollowed,
    };
    graphQLClient(FOLLOW, variables)
      .then(res => {
        if (res && (res.follow || res.unfollow)) {
          pastBroadcast(res.follow || res.unfollow);
        }
      })
      .catch(err => {
        newNotification({
          success: false,
          message:
            err.message === 'Failed to fetch'
              ? 'Network Error. Are you online?'
              : `Could not follow: ${err.message}`,
        });
      });
  };

  const toggleFollowAuthor = () => {
    if (!getUser()) {
      setOpen(true);
      return;
    }
    setChanging(true);
    const roles = getRoles();
    if (roles && roles.indexOf('easylogin') !== -1) {
      callApi(true);
    } else {
      // eslint-disable-next-line no-lonely-if
      if (isFollowed) {
        if (community)
          customJson(['unsubscribe', { community }], 'community').then(res => {
            if (res) {
              callApi(false);
              pastBroadcast(res);
            }
          });
        else
          unfollow(props.author).then(res => {
            if (res) {
              callApi(false);
              pastBroadcast(res);
            }
          });
      } else {
        // eslint-disable-next-line no-lonely-if
        if (community)
          customJson(['subscribe', { community }], 'community').then(res => {
            if (res) {
              callApi(false);
              pastBroadcast(res);
            }
          });
        else
          follow(props.author).then(res => {
            if (res) {
              callApi(false);
              pastBroadcast(res);
            }
          });
      }
    }
  };

  if (isFollowed === undefined) {
    return (
      <>
        {props.btnstyle === 'default' && (
          <Skeleton className="mx-auto" variant="rect" width={70} height={28} />
        )}
      </>
    );
  }
  let btnclass = 'm-1';
  if (props.btnstyle === 'whiteborder') {
    btnclass = 'm-1 border-light';
  }
  const variant = props.btnstyle === 'solid' ? 'contained' : 'outlined';
  const color = props.btnstyle === 'solid' ? 'primary' : 'inherit';
  const size = props.btnstyle === 'solid' ? undefined : 'small';

  return (
    <Fragment>
      {open && (
        <LoginButton
          open={open}
          hideButtons
          onClickClose={() => setOpen(false)}
          text=" to follow your favorite authors and communities"
        />
      )}
      {props.btnstyle === 'menuItem' && isFollowed === undefined && (
        <MenuItem />
      )}
      {(props.btnstyle === 'icon' && (
        <>
          <span className="text-light">
            <IconButton
              color="inherit"
              onClick={() => toggleFollowAuthor()}
              edge="end"
            >
              {(changing && (
                <CircularProgress
                  className="text-light"
                  color="inherit"
                  size={18}
                />
              )) ||
                (isFollowed && <UnfollowIcon />) || <FollowIcon />}
            </IconButton>
          </span>
        </>
      )) ||
        (props.btnstyle === 'menuItem' && (
          <MenuItem
            onClick={() => (changing ? undefined : toggleFollowAuthor())}
          >
            <ListItemIcon>
              {(changing && <CircularProgress color="primary" size={24} />) ||
                (isFollowed && <UnfollowIcon fontSize="small" />) || (
                  <FollowIcon fontSize="small" />
                )}
            </ListItemIcon>
            <ListItemText
              primary={
                isFollowed
                  ? `Unfollow @${props.author}`
                  : `Follow @${props.author}`
              }
            />
          </MenuItem>
        )) || (
          <Button
            disabled={changing}
            variant={variant}
            size={size}
            color={color}
            onClick={() => toggleFollowAuthor()}
            className={btnclass}
          >
            {isFollowed ? (
              <>
                {size === 'small' ? (
                  'Unfollow'
                ) : (
                  <>
                    <UnfollowIcon />
                    <span className="pl-2">Unfollow</span>
                  </>
                )}
              </>
            ) : (
              <>
                {size === 'small' ? (
                  'Follow'
                ) : (
                  <>
                    <FollowIcon /> <span className="pl-2">Follow</span>
                  </>
                )}
              </>
            )}
            {changing && (
              <CircularProgress color="secondary" className="ml-2" size={24} />
            )}
          </Button>
        )}
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
