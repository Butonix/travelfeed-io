import Button from '@material-ui/core/Button';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import WarnIcon from '@material-ui/icons/Warning';
import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import readingTime from 'reading-time';
import sanitize from 'sanitize-html';
import { ONBOARD_INFO } from '../../helpers/graphql/onboarding';
import json2md from '../../helpers/json2md';
import parseBody from '../../helpers/parseBody';
import Checks from '../Editor/Checks';
import EasyEditor from '../Editor/EasyEditor';
import FeaturedImageUpload from '../Editor/FeaturedImageUpload';

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

const OnboardInfo = props => {
  const classes = useStyles();

  const [content, setContent] = useState('');
  const [name, setName] = useState(undefined);
  const [about, setAbout] = useState(undefined);
  const [profile_image, setProfileImage] = useState(undefined);
  const [cover_image, setCoverImage] = useState(undefined);
  const [activeStep, setActiveStep] = React.useState(0);
  const [post, setPost] = useState(undefined);
  const [accountMetadata, setAccountMetadata] = useState(undefined);
  const [mutate, setMutate] = useState(false);
  const [mutatetTriggered, setMutateTriggered] = useState(false);

  const handleEditorChange = value => {
    setContent(value);
  };

  function getSteps() {
    return ['Your profile', 'Your first post', 'Review'];
  }

  const sanitized = sanitize(
    parseBody(json2md(content), {
      lazy: false,
      hideimgcaptions: true,
    }),
    { allowedTags: [] },
  );
  const readingtime = content
    ? readingTime(sanitized)
    : { words: 0, text: '0 min' };

  const checklist = [
    {
      label: (
        <span>
          <WarnIcon />
          {'  '}You need to write more than 250 words
        </span>
      ),
      hide: readingtime.words > 250,
      checked: readingtime.words > 250,
    },
    {
      label:
        'If you are using any media or text that are not your own, please make sure to get permission from the owner and name the source in the post',
    },
  ];

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return (
          <>
            <TextField
              label="Name"
              inputProps={{
                maxLength: 20,
              }}
              placeholder="Your display name"
              margin="normal"
              value={name}
              onChange={res => setName(res.target.value)}
              fullWidth
            />
            <TextField
              label="Profile description"
              inputProps={{
                maxLength: 160,
              }}
              placeholder="Profile description"
              margin="normal"
              value={about}
              onChange={res => setAbout(res.target.value)}
              fullWidth
            />
            <FeaturedImageUpload
              rounded
              featuredImage={profile_image}
              setFeaturedImage={res => setProfileImage(res)}
              placeholder="To upload your profile image, drag 'n' drop an image here, or click to select one. Recommended dimensions: 400x400"
            />
            <FeaturedImageUpload
              featuredImage={cover_image}
              setFeaturedImage={res => setCoverImage(res)}
              placeholder="To upload your cover image, drag 'n' drop an image here, or click to select one. Recommended dimensions: 1920x400"
            />
          </>
        );
      case 1:
        return (
          <>
            <p>
              Now it is time write your first TravelFeed post! In this post you
              should introduce yourself to the TravelFeed community.
            </p>
            <EasyEditor onChange={handleEditorChange} data={content} />
            <Checks checklist={checklist} />
          </>
        );
      case 2:
        return 'Your profile: Your post:';
      default:
        return 'Uknown stepIndex';
    }
  }

  const steps = getSteps();

  function handleNext() {
    setActiveStep(prevActiveStep => prevActiveStep + 1);
  }

  function handleBack() {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  }

  const mutateNow = () => {
    setPost(json2md(content));
    setAccountMetadata(
      JSON.stringify({ name, about, cover_image, profile_image }),
    );
    setMutate(true);
    setMutateTriggered(true);
  };

  const { infoToken } = props;

  return (
    <>
      <Mutation
        mutation={ONBOARD_INFO}
        variables={{
          infoToken,
          post,
          accountMetadata,
        }}
      >
        {(onboardInformation, data) => {
          if (mutate) onboardInformation();
          setMutate(false);
          if (data && data.data && data.data.onboardInformation) {
            if (data.data.onboardInformation.success) {
              return (
                <Typography className={classes.instructions}>
                  You will receive an Email once your account has been approved
                </Typography>
              );
            }
            return (
              <Typography className={classes.instructions}>
                data.data.onboardInformation.message
              </Typography>
            );
          }
          return (
            <>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map(label => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
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
                        disabled={activeStep === 1 && readingtime.words < 251}
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

export default OnboardInfo;
