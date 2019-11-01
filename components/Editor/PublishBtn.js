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
          if (res && res.post) {
            newNotification(res.post);
            props.pastPublish(res.post);
          }
        })
        .catch(err => {
          newNotification({
            success: false,
            message:
              err.message === 'Failed to fetch'
                ? 'Network Error. Are you online?'
                : `Draft could not be saved: ${err.message}`,
          });
        });
      setLoading(false);
    } else {
      post(props.publishThis).then(res => {
        if (res) {
          newNotification(res);
          props.pastPublish(res);
        } else {
          newNotification({
            success: false,
            message: 'Post could not be published',
          });
        }
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    if (props.publishThis && !loading) {
      setLoading(true);
      publishComment();
    }
  }, [props]);

  return (
    <>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={props.triggerPublish}
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
