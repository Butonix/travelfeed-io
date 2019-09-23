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
          props.pastPublish(res);
        } else {
          newNotification({
            success: false,
            message: 'Post could not be published',
          });
          setLoading(undefined);
        }
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
      <Mutation mutation={POST} variables={props.publishThis}>
        {(triggerCommment, { data }) => {
          if (mutate) triggerCommment();
          setMutate(false);
          if (data && data.post) {
            setLoading(false);
            if (loading) {
              newNotification(data.post);
              props.pastPublish(data.post);
            }
          }
          return (
            <>
              <Button
                className="mt-1"
                variant="contained"
                color="primary"
                onClick={props.triggerPublish}
                disabled={props.disabled || loading}
              >
                {props.label}
                {loading && (
                  <CircularProgress
                    className="ml-2"
                    value={loading}
                    size={24}
                  />
                )}
              </Button>
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
