import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { post } from '../../helpers/actions';
import { POST } from '../../helpers/graphql/broadcast';
import graphQLClient from '../../helpers/graphQLClient';
import { getRoles } from '../../helpers/token';

const PublishBtn = props => {
  const [loading, setLoading] = useState(false);

  const newNotification = notification => {
    if (notification !== undefined) {
      let variant = 'success';
      if (notification.success === false) {
        variant = 'error';
      }
      props.enqueueSnackbar(notification.message, { variant });
    }
  };

  const publishComment = () => {
    const roles = getRoles();
    if (roles && roles.indexOf('easylogin') !== -1) {
      graphQLClient(POST, props.publishThis)
        .then(res => {
          setLoading(false);
          if (res && res.post) {
            newNotification(res.post);
            props.pastPublish(res.post);
          }
        })
        .catch(err => {
          setLoading(false);
          newNotification({
            success: false,
            message:
              err.message === 'Failed to fetch'
                ? 'Network Error. Are you online?'
                : `Publish failed: ${err.message}`,
          });
        });
    } else {
      post(props.publishThis).then(res => {
        setLoading(false);
        if (res) {
          newNotification(res);
          props.pastPublish(res);
        } else {
          newNotification({
            success: false,
            message: 'Post could not be published',
          });
        }
      }).catch((err) => {
        setLoading(false)
        newNotification({
          success: false,
          message: `Post could not be published: ${err}`,
        });
      });
    }
  };

  useEffect(() => {
    if (props.publishThis) {
      publishComment();
    }
  }, [props]);

  const onTrigger = () => {
    props.triggerPublish()
    setLoading(true)
  }

  return (
    <>
      <Button
        fullWidth={props.fullWidth}
        variant="contained"
        className={props.mt ? "mt-1" : ''}
        color="primary"
        onClick={onTrigger}
        disabled={props.disabled || loading}
      >
        {props.label}
        {loading && (
          <CircularProgress className="ml-2" value={loading} size={24} />
        )}
      </Button>
    </>
  );
};

PublishBtn.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
};

export default withSnackbar(PublishBtn);
