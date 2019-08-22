import Button from '@material-ui/core/Button';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React, { useEffect, useState } from 'react';
import { Mutation } from 'react-apollo';
import steem from 'steem';
import { ONBOARD_CREATE } from '../../helpers/graphql/onboarding';
import generateSteemPassphrase from '../../helpers/steeminvite/generateSteemPassphrase';
import AccountSetup from './AccountSetup';
import AccountTypePicker from './AccountTypePicker';
import EasyLogin from './EasyLogin';
import PasswordPicker from './PasswordPicker';
import SteemKeys from './SteemKeys';
import UsernamePicker from './UsernamePicker';

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

  const getPubKeys = () => {
    const roles = ['active', 'owner', 'posting', 'memo'];
    return steem.auth.generateKeys(props.username, passPhrase, roles);
  };

  useEffect(() => {
    setPassPhrase(generateSteemPassphrase());
  }, []);

  const pubKeys = getPubKeys();

  function isStepOptional(step) {
    return step === 2;
  }

  function getSteps() {
    return [
      'Pick a username',
      'Pick your account type',
      'Choose your password',
      'Save your keys',
      'Confirm',
    ];
  }

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <>
            {(username && `You have picked the username @${username}`) ||
              'Pick a username'}
            <UsernamePicker
              data={username}
              placeholder="Pick a username"
              onChange={res => setUserName(res)}
            />
          </>
        );
      case 1:
        return (
          <>
            TravelFeed is built on the Steem blockchain, a next level technology
            powered by a decentralised ledger and strong encryption. Fxor most
            users, a regular Steem account is too uncomfortable to use, this is
            why we offer you to set up your STEEM account with TravelFeed
            EasyLogin
            <AccountTypePicker setAccountType={pickAccountType} />
          </>
        );
      case 2:
        return (
          <>
            {accountType === 0 && (
              <EasyLogin
                password={password}
                setPassword={setPassword}
                passwordConfirm={passwordConfirm}
                setPasswordConfirm={setPasswordConfirm}
              />
            )}
          </>
        );
      case 3:
        return (
          <>
            <SteemKeys username={username} passPhrase={passPhrase} />
          </>
        );
      case 4:
        return (
          <>
            <p>
              To confirm that you have stored your Steem passphrase securely,
              please reenter it
            </p>
            <PasswordPicker
              label="Confirm Passphrase"
              password={passPhraseConfirm}
              setPassword={setPassPhraseConfirm}
            />
          </>
        );
      default:
        return 'Uknown stepIndex';
    }
  }

  const steps = getSteps();

  function handleNext() {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  }

  function handleBack() {
    if (accountType === 1 && activeStep === 3) setActiveStep(1);
    else setActiveStep(prevActiveStep => prevActiveStep - 1);
  }

  const mutateNow = () => {
    setMutate(true);
    setMutateTriggered(true);
  };

  const pickAccountType = res => () => {
    setAccountType(res);
    if (res === 1) setActiveStep(3);
    else handleNext();
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
          password,
        }}
      >
        {(onboardCreate, data) => {
          if (mutate) onboardCreate();
          setMutate(false);
          if (data && data.data && data.data.onboardCreate) {
            if (data.data.onboardCreate.success) {
              return <AccountSetup />;
            }
            return (
              <Typography className={classes.instructions}>
                Account could not be created :(
              </Typography>
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
                  <div>
                    <Typography className={classes.instructions}>
                      {getStepContent(activeStep)}
                    </Typography>
                    <div>
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
                          (activeStep === 2 && password !== passwordConfirm) ||
                          (activeStep === 4 && passPhrase !== passPhraseConfirm)
                        }
                      >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                      </Button>
                    </div>
                  </div>
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
