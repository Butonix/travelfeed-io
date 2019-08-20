import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import isEmail from 'validator/lib/isEmail';
import { ONBOARD_START } from '../../helpers/graphql/onboarding';
import Link from '../../lib/Link';

const OnboardStart = props => {
  const [email, setEmail] = useState(undefined);
  const [newsletter, setNewsletter] = useState(false);
  const [tos, setTos] = useState(false);
  const [isMailValid, setMailValid] = useState(true);
  const [isTosValid, setTosValid] = useState(true);
  const [mutate, setMutate] = useState(false);

  const { referrer } = props;

  const handleEmailChange = () => event => {
    setEmail(event.target.value);
  };

  const submit = () => () => {
    const validateMail = email ? isEmail(email) : false;
    const validateTos = tos;
    setMailValid(validateMail);
    setTosValid(validateTos);
    if (validateMail && validateTos) setMutate(true);
  };

  return (
    <>
      <Mutation
        mutation={ONBOARD_START}
        variables={{
          email,
          newsletter,
          referrer,
        }}
      >
        {(onboardStart, data) => {
          if (mutate) onboardStart();
          setMutate(false);
          if (data && data.data && data.data.onboardStart) {
            if (data.data.onboardStart.success) {
              return 'You have received an email';
            }
            return data.data.onboardStart.message;
          }
          return (
            <>
              <FormGroup>
                <FormControl required error={!isTosValid}>
                  <TextField
                    id="outlined-email-input"
                    label="Email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    margin="normal"
                    variant="outlined"
                    value={email}
                    onChange={handleEmailChange()}
                    error={!isMailValid}
                  />
                  {!isMailValid && (
                    <FormHelperText>A valid email is required</FormHelperText>
                  )}
                </FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={newsletter}
                      onChange={() => setNewsletter(!newsletter)}
                    />
                  }
                  label="Subscribe to the TravelFeed newsletter"
                />
                <FormControl required error={!isTosValid}>
                  <FormControlLabel
                    control={
                      <Checkbox checked={tos} onChange={() => setTos(!tos)} />
                    }
                    label={
                      <>
                        I have read and accept the{' '}
                        <Link href="/about/tos" passHref>
                          <a>terms of service</a>
                        </Link>
                        , the{' '}
                        <Link href="/about/privacy" passHref>
                          <a>privacy policy</a>{' '}
                        </Link>{' '}
                        and the{' '}
                        <Link href="/about/cookies" passHref>
                          <a>cookie policy</a>
                        </Link>{' '}
                        (required)
                      </>
                    }
                  />
                  {!isTosValid && (
                    <FormHelperText>
                      You need to accept our terms of service, privacy policy
                      and cookie policy to continue
                    </FormHelperText>
                  )}
                </FormControl>
                TODO: HCaptcha
                <Button variant="contained" color="primary" onClick={submit()}>
                  Submit
                </Button>
              </FormGroup>
            </>
          );
        }}
      </Mutation>
    </>
  );
};

export default OnboardStart;
