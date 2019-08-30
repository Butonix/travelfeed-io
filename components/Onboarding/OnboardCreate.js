import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormLabel from '@material-ui/core/FormLabel';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import owasp from 'owasp-password-strength-test';
import React, { useEffect, useState } from 'react';
import { Mutation } from 'react-apollo';
import steem from 'steem';
import { ONBOARD_CREATE } from '../../helpers/graphql/onboarding';
import generateSteemPassphrase from '../../helpers/steeminvite/generateSteemPassphrase';
import Link from '../../lib/Link';
import AccountTypePicker from './AccountTypePicker';
import EasyLogin from './EasyLogin';
import PasswordPicker from './PasswordPicker';
import SteemKeys from './SteemKeys';
import UsernamePicker from './UsernamePicker';

owasp.config({
  maxLength: 72,
});

const useStyles = makeStyles(theme => ({
  root: {
    width: '90%',
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

const OnboardCreate = props => {
  const classes = useStyles();

  const [username, setUserName] = useState('');
  const [activeStep, setActiveStep] = React.useState(0);
  const [mutate, setMutate] = useState(false);
  const [mutatetTriggered, setMutateTriggered] = useState(false);
  const [accountType, setAccountType] = useState(0);
  const [passPhrase, setPassPhrase] = useState(undefined);
  const [passPhraseConfirm, setPassPhraseConfirm] = useState(undefined);
  const [password, setPassword] = useState(undefined);
  const [passwordConfirm, setPasswordConfirm] = useState(undefined);

  const pwstrength = password ? owasp.test(password) : {};

  const getPubKeys = () => {
    const roles = ['active', 'owner', 'posting', 'memo'];
    return steem.auth.generateKeys(username, passPhrase, roles);
  };

  useEffect(() => {
    setPassPhrase(generateSteemPassphrase());
  }, []);

  const pubKeys = getPubKeys();

  function getSteps() {
    return [
      'Pick a username',
      'Pick your account type',
      'Choose your password',
      'Save your keys',
      'Confirm',
    ];
  }

  function handleNext() {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  }

  const pickAccountType = res => () => {
    setAccountType(res);
    if (res === 1) setActiveStep(3);
    else handleNext();
  };

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <>
            <FormLabel component="legend">
              {(username && (
                <span>
                  You have chosen the username <strong>{username}</strong>
                </span>
              )) ||
                'Choose a username below. Your username cannot be changed once your account has been created!'}
            </FormLabel>
            <div className="pb-3">
              <UsernamePicker
                data={username}
                placeholder="Pick a username"
                onChange={res => setUserName(res)}
              />
            </div>
          </>
        );
      case 1:
        return (
          <>
            <FormLabel component="legend" className="pb-3">
              TravelFeed is built on the Steem blockchain, a next generation
              technology powered by a decentralised ledger and strong
              encryption. For most users, a regular Steem account is too
              uncomfortable to use, this is why we offer you to set up your
              STEEM account with TravelFeed EasyLogin.
            </FormLabel>
            <div className="pt-3 pb-3">
              <AccountTypePicker setAccountType={pickAccountType} />
            </div>
          </>
        );
      case 2:
        if (accountType === 0)
          return (
            <>
              <FormLabel component="legend" className="pb-3">
                Choose your TravelFeed password here. With your TravelFeed
                password you can log in to TravelFeed. Your password should be
                between 10 and 72 characters long.
              </FormLabel>
              <div className="pb-2">
                <EasyLogin
                  pwstrength={pwstrength}
                  password={password}
                  setPassword={setPassword}
                  passwordConfirm={passwordConfirm}
                  setPasswordConfirm={setPasswordConfirm}
                />
              </div>
            </>
          );
        return '';
      case 3:
        return (
          <>
            <FormLabel component="legend" className="pt-2 pb-2">
              {accountType === 0 && (
                <span>
                  Since you have chosen EasyLogin, you will only need your Steem
                  keys to perform actions such as transferring your funds or
                  using other Steem dApps.{' '}
                </span>
              )}
              Your Steem keys <strong>cannot be recovered</strong> - if you
              forget them, you loose access to your account and any funds that
              are on it <strong>forever</strong>. This is why it is extremely
              important that you store them savely. We recommend to download
              your Steem keys and store them offline and/or print them out.
            </FormLabel>
            <SteemKeys username={username} passPhrase={passPhrase} />
            <FormLabel component="legend" className="pt-2 pb-2">
              Want to know more about your Steem keys? Watch this video by
              TravelFeed user{' '}
              <Link as="/@coruscate" href="/blog?author=coruscate" passHref>
                <a>@coruscate</a>
              </Link>
              .
            </FormLabel>
            <div className="pb-3 pt-3">
              <div className="embed-responsive embed-responsive-16by9">
                <iframe
                  title="Steem Onboarding - Passwords, Keys and Security"
                  className="embed-responsive-item"
                  src="https://www.youtube.com/embed/HSxYKW9X8_I"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <FormLabel component="legend" className="pb-2">
              To confirm that you have stored your Steem passphrase securely,
              please reenter it below. Remember, if you ever loose your
              passphrase, <strong>we cannot recover it</strong> and you will
              loose access to your account and all funds on it permanently!
            </FormLabel>
            <div className="pb-2">
              <PasswordPicker
                autofocus
                label="Confirm Passphrase"
                password={passPhraseConfirm}
                setPassword={setPassPhraseConfirm}
                isValid={!passPhraseConfirm || passPhraseConfirm === passPhrase}
                helper={
                  passPhraseConfirm &&
                  passPhraseConfirm !== passPhrase &&
                  'This does not match your passphrase'
                }
              />
            </div>
          </>
        );
      default:
        return 'Uknown stepIndex';
    }
  }

  const steps = getSteps();

  function handleBack() {
    if (accountType === 1 && activeStep === 3) setActiveStep(1);
    else setActiveStep(prevActiveStep => prevActiveStep - 1);
  }

  const mutateNow = () => {
    setMutate(true);
    setMutateTriggered(true);
  };

  const { claimToken } = props;

  return (
    <>
      <Mutation
        mutation={ONBOARD_CREATE}
        variables={{
          claimToken,
          username,
          postingPubKey: pubKeys.posting,
          activePubKey: pubKeys.active,
          memoPubKey: pubKeys.memo,
          ownerPubKey: pubKeys.owner,
          password: accountType === 0 ? password : undefined,
        }}
      >
        {(onboardCreate, { data, loading, error }) => {
          if (mutate) onboardCreate();
          setMutate(false);
          if (loading) {
            return (
              <>
                <FormLabel component="legend">
                  Please wait a few seconds while we set up your account...
                </FormLabel>
                <div className="pt-3 text-center">
                  <CircularProgress />
                </div>
              </>
            );
          }
          if (data && data.onboardCreate) {
            if (data.onboardCreate.success) {
              return (
                <FormLabel component="legend">
                  Your account has been created! You can now log in.
                </FormLabel>
              );
            }
            return (
              <FormLabel component="legend">
                Account could not be created: {data.onboardCreate.message}
              </FormLabel>
            );
          }
          if (error) {
            return (
              <FormLabel component="legend">
                Account could not be created :(
              </FormLabel>
            );
          }
          return (
            <>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label, i) => {
                  const stepProps = {};
                  if (accountType === 1 && i === 2) stepProps.completed = false;
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              <div>
                {activeStep === steps.length ? (
                  <div>{!mutatetTriggered && mutateNow()}</div>
                ) : (
                  <>
                    <div>
                      <Typography className={classes.instructions}>
                        {getStepContent(activeStep)}
                      </Typography>
                    </div>
                    <div className="w-100 text-right">
                      <Button
                        disabled={activeStep === 0}
                        onClick={handleBack}
                        className={classes.backButton}
                      >
                        Back
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleNext}
                        disabled={
                          (activeStep === 0 && username === '') ||
                          (activeStep === 2 &&
                            (!password ||
                              password !== passwordConfirm ||
                              (pwstrength.errors &&
                                pwstrength.errors.length > 0))) ||
                          (activeStep === 4 && passPhrase !== passPhraseConfirm)
                        }
                      >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </>
          );
        }}
      </Mutation>
    </>
  );
};

export default OnboardCreate;
