import Button from '@material-ui/core/Button';
import FormLabel from '@material-ui/core/FormLabel';
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
import categoryFinder from '../../helpers/categoryFinder';
import { ONBOARD_INFO } from '../../helpers/graphql/onboarding';
import json2md from '../../helpers/json2md';
import parseBody from '../../helpers/parseBody';
import Link from '../../lib/Link';
import Checks from '../Editor/Checks';
import EasyEditor from '../Editor/EasyEditor';
import EditorPreview from '../Editor/EditorPreview';
import FeaturedImageUpload from '../Editor/FeaturedImageUpload';
import TagPicker from '../Editor/TagPicker';
import AuthorProfileHeader from '../Profile/AuthorProfileHeader';

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

  const defaultTags = ['travelfeed', 'introduceyourself'];
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
  const [tags, setTags] = useState([]);
  const [tagRecommendations, setTagRecommendations] = useState([]);

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

  const handleEditorChange = value => {
    setContent(value);
    setTagRecommendations(
      categoryFinder(
        sanitize(
          parseBody(json2md(value), {
            lazy: false,
            hideimgcaptions: true,
          }),
          { allowedTags: [] },
        ),
      ),
    );
  };

  const handleTagClick = taglist => {
    setTags(taglist);
  };

  function getSteps() {
    return ['Your profile', 'Your first post', 'Review'];
  }

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
      label: (
        <span>
          <WarnIcon />
          {'  '}You need to select at least 1 more tag
        </span>
      ),
      hide: tags.length > 0,
      checked: tags.length > 0,
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
            <FormLabel component="legend">
              Now it is time to complete your TravelFeed profile. Select your
              display name, slogan, cover image and profile image to proceed
              with setting up your account. They can all be changed later.
            </FormLabel>
            <TextField
              label="Display name"
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
              multiline
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
            <div className="p-2">
              <FeaturedImageUpload
                rounded
                featuredImage={profile_image}
                setFeaturedImage={res => setProfileImage(res)}
                placeholder="To upload your profile image, drag 'n' drop an image here, or click to select one. Recommended dimensions: 400x400"
              />
            </div>
            <div className="p-2">
              <FeaturedImageUpload
                featuredImage={cover_image}
                setFeaturedImage={res => setCoverImage(res)}
                placeholder="To upload your cover image, drag 'n' drop an image here, or click to select one. Recommended dimensions: 1920x400"
              />
            </div>
          </>
        );
      case 1:
        return (
          <>
            <FormLabel component="legend">
              Now it is time write your first TravelFeed post! In this post you
              should introduce yourself to the TravelFeed community.
            </FormLabel>
            <EasyEditor onChange={handleEditorChange} data={content} />
            <TagPicker
              recommendations={tagRecommendations}
              defaultTags={defaultTags}
              value={tags}
              onTagChange={handleTagClick}
            />
            <div className="pt-5 pb-2">
              <Checks checklist={checklist} />
            </div>
            <FormLabel component="legend" className="pt-3 pb-2">
              Need ideas for your introduction post? Watch this video by
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
                  src="https://www.youtube.com/embed/6dlqe0ckWhA"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <Typography
              variant="h4"
              className="textSecondary"
              align="center"
              gutterBottom
            >
              Your profile
            </Typography>
            <div>
              <AuthorProfileHeader
                data={{
                  display_name: name,
                  about,
                  cover_image,
                  profile_image,
                }}
              />
            </div>
            <Typography
              variant="h4"
              className="textSecondary"
              align="center"
              gutterBottom
            >
              Your post
            </Typography>
            <EditorPreview
              fullsize
              img_url={cover_image}
              title={`Introducing myself to TravelFeed: ${name}`}
              // permlink={permlink}
              readtime={readingtime}
              content={json2md(content)}
              tags={tags}
            />
          </>
        );
      default:
        return 'Unknown stepIndex';
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
                      <div className="text-right pt-2">
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
                            (activeStep === 1 &&
                              (readingtime.words < 251 || tags.length < 1)) ||
                            (activeStep === 0 &&
                              (!name ||
                                !about ||
                                !cover_image ||
                                !profile_image))
                          }
                        >
                          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                      </div>
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