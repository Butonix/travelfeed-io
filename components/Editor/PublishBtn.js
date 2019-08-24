// FIXME: Broadcast is triggered twice
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Mutation } from 'react-apollo';
import { post } from '../../helpers/actions';
import { POST } from '../../helpers/graphql/broadcast';
import { getRoles } from '../../helpers/token';

const PublishBtn = props => {
  const [mutate, setMutate] = useState(false);
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
      setMutate(true);
    } else {
      post(props.publishThis).then(res => {
        if (res) {
          newNotification(res);
          setLoading(undefined);
          props.setSuccess();
        }
      });
    }
  };

  useEffect(() => {
    if (props.publishThis && !props.success && !loading) {
      setLoading(true);
      publishComment();
    }
  }, [props]);

  return (
    <>
      <Mutation mutation={POST} variables={props.publishThis}>
        {(triggerCommment, { data }) => {
          if (mutate) triggerCommment();
          setMutate(false);
          if (data && data.post) {
            setLoading(false);
            if (loading) {
              newNotification(data.post);
              props.setSuccess();
            }
          }
          return (
            <>
              <Button
                className="mt-1"
                variant="contained"
                color="primary"
                onClick={props.triggerPublish}
                disabled={props.disabled}
              >
                {(props.editMode && 'Edit') || 'Reply'}
              </Button>
              {loading && (
                <CircularProgress
                  value={loading}
                  className="p-1"
                  size={35}
                  thickness={5}
                />
              )}
            </>
          );
        }}
      </Mutation>
    </>
  );
};

PublishBtn.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
};

export default withSnackbar(PublishBtn);
