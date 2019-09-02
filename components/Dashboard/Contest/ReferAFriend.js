import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import { withSnackbar } from 'notistack';
import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import isEmail from 'validator/lib/isEmail';
import { REFERRAL_MAIL } from '../../../helpers/graphql/contest';

const ReferAFriend = props => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const newNotification = notification => {
    if (notification !== undefined) {
      let variant = 'success';
      if (notification.success === false) {
        variant = 'error';
      }
      props.enqueueSnackbar(notification.message, { variant });
    }
  };

  return (
    <>
      <Mutation
        mutation={REFERRAL_MAIL}
        variables={{
          email,
          message,
        }}
      >
        {(
          referralMail,
          // eslint-disable-next-line no-shadow
          { data, loading },
        ) => {
          if (loading) return <CircularProgress />;
          if (data && data.referralMail) {
            if (data.referralMail.success) {
              setEmail('');
              setMessage('');
            }
            newNotification(data.referralMail);
          }
          return (
            <>
              <div className="pt-1 pb-1">
                <TextField
                  label="Email"
                  fullWidth
                  multiline
                  value={email}
                  onChange={val => setEmail(val.target.value)}
                />
              </div>
              <div className="pt-1 pb-1">
                <TextField
                  label="Message"
                  fullWidth
                  multiline
                  value={message}
                  onChange={val => setMessage(val.target.value)}
                />
              </div>
              <div className="pt-1 pb-1">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={referralMail}
                  disabled={!isEmail(email)}
                >
                  Invite
                </Button>
              </div>
            </>
          );
        }}
      </Mutation>
    </>
  );
};

export default withSnackbar(ReferAFriend);
