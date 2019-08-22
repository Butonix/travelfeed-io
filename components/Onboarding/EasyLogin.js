import Typography from '@material-ui/core/Typography';
import React from 'react';
import PasswordPicker from './PasswordPicker';

const EasyLogin = props => {
  return (
    <>
      <Typography variant="h5" className="pt-4" gutterBottom>
        TravelFeed password
      </Typography>
      <p>
        Choose a TravelFeed password here. With your TravelFeed password you can
        log in to TravelFeed. You will only need your Steem keys to perform
        actions such as transferring your funds or using other Steem apps.
      </p>
      <PasswordPicker
        label="Password"
        password={props.password}
        setPassword={props.setPassword}
      />
      <PasswordPicker
        label="Confirm password"
        password={props.passwordConfirm}
        setPassword={props.setPasswordConfirm}
      />
    </>
  );
};

export default EasyLogin;
