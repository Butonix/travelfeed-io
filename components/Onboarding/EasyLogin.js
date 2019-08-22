import React from 'react';
import PasswordPicker from './PasswordPicker';

const EasyLogin = props => {
  return (
    <>
      {
        // We don't require Uppercase letters, numbers, special chars etc -
        // passphrases are very secure as well, it's the user's choice
      }
      <PasswordPicker
        autofocus
        label="Password"
        password={props.password}
        setPassword={props.setPassword}
        isValid={
          props.password &&
          (props.password.length > 9 && props.password.length < 73)
        }
        helper={
          (props.password &&
            (props.password.length < 10 &&
              'Your password needs to be at least 10 characters long')) ||
          (props.password &&
            (props.password.length > 72 &&
              'Your password cannot be longer than 72 charcters'))
        }
      />
      <PasswordPicker
        label="Confirm password"
        password={props.passwordConfirm}
        setPassword={props.setPasswordConfirm}
        helper={
          props.password &&
          props.passwordConfirm &&
          props.password !== props.passwordConfirm &&
          'This needs to match your password'
        }
        isValid={
          !props.password ||
          !props.passwordConfirm ||
          props.password === props.passwordConfirm
        }
      />
    </>
  );
};

export default EasyLogin;
