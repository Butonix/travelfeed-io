import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { withSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { isWebpSupported } from 'react-image-webp/dist/utils';
import readingTime from 'reading-time';
import sanitize from 'sanitize-html';
import {
  ADD_CURATION_AUTHOR_NOTES,
  GET_CURATION_AUTHOR_NOTES,
  GET_CURATION_SCORES,
} from '../../helpers/graphql/curation';
import { GET_POSTS } from '../../helpers/graphql/posts';
import graphQLClient from '../../helpers/graphQLClient';
import parseBody from '../../helpers/parseBody';
import parseHtmlToReact from '../../helpers/parseHtmlToReact';
import FixedBackgroundImage from '../General/FixedBackgroundImage';
import PostContent from '../Post/PostContent';
import DotOptions from './Curation/DotOptions';
import EditAuthorNotesDialog from './Curation/EditAuthorNotesDialog';
import FinalCuration from './Curation/FinalCuration';
import StickyCurationSlider from './Curation/StickyCurationSlider';

const useStyles = makeStyles(() => ({
  topBar: {
    borderRadius: 0,
    position: 'fixed',
    top: 0,
    right: 0,
    width: '100%',
    zIndex: '900',
  },
}));

const Curation = props => {
  const classes = useStyles();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [curationScores, setCurationScores] = useState([]);
  const [postPosition, setPostPosition] = useState(0);
  const [curationAuthorNotes, setCurationAuthorNotes] = useState([]);
  const [finished, setFinished] = useState(false);
  const [webpSupport, setWebpSupport] = useState(undefined);
  const [state, setState] = React.useState({
    formatting: false,
    language: false,
    bilingual: false,
    footer: false,
    photos: false,
    short: false,
    writing: false,
    valueadding: false,
  });

  const handleGetCurationScores = () => {
    graphQLClient(GET_CURATION_SCORES).then(({ getCurationScores }) => {
      setCurationScores(getCurationScores);
    });
  };

  const getCheckboxes = (author, notes) => {
    notes.forEach((note, i) => {
      if (note.author === author) {
        setState({
          formatting: notes[i].formatting === true,
          language: notes[i].language === true,
          bilingual: notes[i].bilingual === true,
          footer: notes[i].footer === true,
          photos: notes[i].photos === true,
          short: notes[i].short === true,
          writing: notes[i].writing === true,
          valueadding: notes[i].valueadding === true,
        });
      }
    });
  };

  const handleFetchedPosts = fetchedPosts => {
    setPosts(fetchedPosts);
    const newPosts = fetchedPosts;
    const authors = [];
    fetchedPosts.forEach((post, i) => {
      if (authors.indexOf(post.author) === -1) authors.push(post.author);
      const vl = post.votes.split('\n');
      vl.forEach(el => {
        const element = el.split(',');
        const voter = element[0];
        if (voter === 'travelfeedio') {
          newPosts.splice(i, 1);
        }
      });
      fetch(`https://blacklist.usesteem.com/user/${post.author}`)
        .then(response => {
          return response.json();
        })
        .then(res => {
          if (res.blacklisted.length > 0)
            newPosts[i].blacklisted = res.blacklisted;
        });
    });
    setPosts(newPosts);
    graphQLClient(GET_CURATION_AUTHOR_NOTES, { authors }).then(
      ({ getCurationAuthorNotes }) => {
        if (getCurationAuthorNotes && getCurationAuthorNotes.length > 0) {
          setCurationAuthorNotes(getCurationAuthorNotes);
          getCheckboxes(newPosts[0].author, getCurationAuthorNotes);
        }
      },
    );
  };

  const fetchPosts = () => {
    graphQLClient(GET_POSTS, {
      orderby: 'created_at',
      min_curation_score: 0,
      limit: 80,
      exclude_authors: ['travelfeed', 'steemitworldmap'],
    }).then(res => {
      handleFetchedPosts(res.posts);
    });
  };

  useEffect(() => {
    fetchPosts();
    setWebpSupport(isWebpSupported());
  }, []);

  const newNotification = notification => {
    if (notification !== undefined) {
      let variant = 'success';
      if (notification.success === false) {
        variant = 'error';
      }
      props.enqueueSnackbar(notification.message, { variant });
    }
  };

  const handleSwitchPost = newPostPosition => {
    if (posts.length > newPostPosition && newPostPosition >= 0) {
      setLoading(true);
      setTimeout(() => {
        setPostPosition(newPostPosition);
        setLoading(false);
      }, 1);
    } else {
      handleGetCurationScores();
      setFinished(true);
      return;
    }
    setState({
      formatting: false,
      language: false,
      bilingual: false,
      footer: false,
      photos: false,
      short: false,
      writing: false,
      valueadding: false,
    });
    getCheckboxes(posts[newPostPosition].author, curationAuthorNotes);
  };

  const handleBack = () => {
    handleSwitchPost(postPosition - 1);
  };

  const handleNext = () => {
    handleSwitchPost(postPosition + 1);
  };

  const handleFinal = () => {
    handleGetCurationScores();
    setFinished(true);
  };

  const handleSetPostWeight = (author, permlink, weight) => {
    const newPosts = posts;
    posts.forEach((post, i) => {
      if (post.permlink === permlink && post.author === author) {
        newPosts[i].weight = weight;
      }
    });
    setPosts(newPosts);
  };

  const handleCheckboxCheck = name => event => {
    setState({ ...state, [name]: event.target.checked });
    const variables = {
      author: posts[postPosition].author,
      [name]: event.target.checked,
    };
    graphQLClient(ADD_CURATION_AUTHOR_NOTES, variables).then(
      ({ addCurationAuthorNotes }) => {
        if (!addCurationAuthorNotes.success)
          newNotification(addCurationAuthorNotes);
      },
    );
  };

  if (finished)
    return (
      <>
        <Card>
          <CardContent>
            <Typography gutterBottom variant="h6">
              You did it! These are all the posts you rated sorted by how much
              you liked them. You can change the scores using the up- and
              down-buttons. When you are happy, scroll down and press{' '}
              <em>process curation</em>, the backend will take care of the rest!
            </Typography>
            <FinalCuration curationScores={curationScores} />
          </CardContent>
        </Card>
      </>
    );

  if (posts.length < postPosition) return <>No more posts </>;
  if (posts && posts.length > 0) {
    const {
      author,
      post_id,
      body,
      json,
      latitude,
      longitude,
      category,
      permlink,
      display_name,
      created_at,
      country_code,
      subdivision,
      tags,
      curation_score,
      title,
      img_url,
      app,
      blacklisted,
      weight,
    } = posts[postPosition];
    const isIntro =
      tags.indexOf('introduceyourself') !== -1 &&
      !permlink.match(/introducing-myself-to-travelfeed-/);
    const isTf = app && app.split('/')[0] === 'travelfeed';
    const htmlBody = parseBody(body, {});
    const sanitized = sanitize(htmlBody, { allowedTags: [] });
    const readtime = readingTime(sanitized);
    const reactParsed = parseHtmlToReact(htmlBody, {
      hideimgcaptions: !isTf,
      webpSupport,
    });
    const { bodyText } = reactParsed;
    const bodycontent = (
      // eslint-disable-next-line react/no-danger
      <div className="textPrimary postcontent postCardContent postanchors">
        <Typography gutterBottom variant="h2">
          {title}
        </Typography>
        {bodyText}
      </div>
    );
    let notes;
    let attentionColor;
    let attentionLevel;
    if (curationAuthorNotes.length > 0) {
      let index;
      curationAuthorNotes.forEach((note, i) => {
        if (note.author === author) index = i;
      });
      if (index) {
        notes = curationAuthorNotes[index].notes;
        attentionLevel = curationAuthorNotes[index].attentionLevel;
        if (attentionLevel === '1') attentionColor = 'bg-success';
        else if (attentionLevel === '2') attentionColor = 'bg-warning';
        else if (attentionLevel === '3') attentionColor = 'bg-danger';
      }
    }
    return (
      <>
        <Card className={classes.topBar}>
          <div className="container">
            <div className="row">
              <div
                className={`col ${
                  blacklisted && blacklisted.length > 0
                    ? 'bg-danger'
                    : attentionColor
                }`}
              >
                {notes ? <></> : <p>Author notes:</p>}
                <p>
                  {notes && notes.length > 130
                    ? `${notes.substring(0, 130)}[...]`
                    : notes}
                </p>
                <p>
                  {blacklisted && blacklisted.length > 0
                    ? `Blacklisted by ${blacklisted}`
                    : ''}{' '}
                </p>
                <EditAuthorNotesDialog
                  author={author}
                  initialAttentionLevel={attentionLevel}
                  initialNotes={notes}
                />
              </div>
              <>
                <div className="col-xl col-lg col-md col-sm-4 col-4">
                  <FormControl component="fieldset">
                    <FormGroup>
                      <Tooltip title="E.g. bad use of font formatting, missing structure/subheadings, photos interrupting the reading flow">
                        <FormControlLabel
                          control={
                            <Checkbox
                              icon="☺"
                              checkedIcon="🙁"
                              checked={state.formatting}
                              onChange={handleCheckboxCheck('formatting')}
                            />
                          }
                          label="Formatting"
                        />
                      </Tooltip>
                      <Tooltip title="Grammar, spelling">
                        <FormControlLabel
                          control={
                            <Checkbox
                              icon="☺"
                              checkedIcon="🙁"
                              checked={state.language}
                              onChange={handleCheckboxCheck('language')}
                            />
                          }
                          label="Language"
                        />
                      </Tooltip>
                    </FormGroup>
                  </FormControl>
                </div>

                <div className="col-xl col-lg col-md col-sm-4 col-4">
                  <FormControl component="fieldset">
                    <FormGroup>
                      <Tooltip title="Paragraphs of non-English or bilingual text disturb the reading flow">
                        <FormControlLabel
                          control={
                            <Checkbox
                              icon="☺"
                              checkedIcon="🙁"
                              checked={state.bilingual}
                              onChange={handleCheckboxCheck('bilingual')}
                            />
                          }
                          label="Bilingual"
                        />
                      </Tooltip>
                      <Tooltip title="Overly long or ugly footer">
                        <FormControlLabel
                          control={
                            <Checkbox
                              icon="☺"
                              checkedIcon="🙁"
                              checked={state.footer}
                              onChange={handleCheckboxCheck('footer')}
                            />
                          }
                          label="Footer"
                        />
                      </Tooltip>
                    </FormGroup>
                  </FormControl>
                </div>
                <div className="col-xl col-lg col-md col-sm-4 col-4">
                  <FormControl component="fieldset">
                    <FormGroup>
                      <Tooltip title="Bad photo quality or too little photos">
                        <FormControlLabel
                          control={
                            <Checkbox
                              icon="☺"
                              checkedIcon="🙁"
                              checked={state.photos}
                              onChange={handleCheckboxCheck('photos')}
                            />
                          }
                          label="Photos"
                        />
                      </Tooltip>
                      <Tooltip title="It feels like the author was counting words to get to 250, the post feels too short">
                        <FormControlLabel
                          control={
                            <Checkbox
                              icon="☺"
                              checkedIcon="🙁"
                              checked={state.short}
                              onChange={handleCheckboxCheck('short')}
                            />
                          }
                          label="Length"
                        />
                      </Tooltip>
                    </FormGroup>
                  </FormControl>
                </div>
                <div className="col-xl col-lg col-md col-sm-4 col-4">
                  <FormControl component="fieldset">
                    <FormGroup>
                      <Tooltip title="Blog is boring to read, e.g. mostly describing photos instead of telling a coherent story">
                        <FormControlLabel
                          control={
                            <Checkbox
                              icon="☺"
                              checkedIcon="🙁"
                              checked={state.writing}
                              onChange={handleCheckboxCheck('writing')}
                            />
                          }
                          label="Writing"
                        />
                      </Tooltip>
                      <Tooltip title="Goood blogs should not just be selfies like a Facebook post, but add value by being informative or telling an exciting story">
                        <FormControlLabel
                          control={
                            <Checkbox
                              icon="☺"
                              checkedIcon="🙁"
                              checked={state.valueadding}
                              onChange={handleCheckboxCheck('valueadding')}
                            />
                          }
                          label="Value-adding"
                        />
                      </Tooltip>
                    </FormGroup>
                  </FormControl>
                </div>
              </>
              <div className="col-xl col-lg col-md col-sm-4 col-4">
                <DotOptions
                  handleBack={handleBack}
                  handleNext={handleNext}
                  handleFinal={handleFinal}
                  sanitized={sanitized}
                />
              </div>
            </div>
          </div>
        </Card>
        <StickyCurationSlider
          body={body}
          author={author}
          permlink={permlink}
          title={title}
          handleNext={handleNext}
          handleSetPostWeight={postWeight =>
            handleSetPostWeight(author, permlink, postWeight)
          }
          weight={weight}
          isTf={isTf}
          state={state}
          location={!country_code}
        />
        <Grid
          container
          spacing={0}
          alignItems="center"
          justify="center"
          className="mt-5"
        >
          <Grid item lg={8} md={10} sm={11} xs={12} className="pb-2">
            <Card className="mt-5 mb-5">
              {!loading && (
                <PostContent
                  isIntro={isIntro}
                  showWordCount
                  author={author}
                  id={post_id}
                  body={body}
                  json={json}
                  latitude={latitude}
                  longitude={longitude}
                  category={category}
                  isTf={isTf}
                  permlink={permlink}
                  display_name={display_name}
                  created_at={created_at}
                  readtime={readtime}
                  content={bodycontent}
                  country_code={country_code}
                  subdivision={subdivision}
                  tags={tags}
                  curationScore={curation_score}
                  title={title}
                  img_url={img_url}
                />
              )}
            </Card>
          </Grid>
        </Grid>
      </>
    );
  }
  return (
    <>
      <FixedBackgroundImage
        backgroundImage="https://img.travelfeed.io/jpphotography%2F20190928T184750380Z-easysignup-3.jpg"
        component={
          <>
            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              style={{ minHeight: '100vh', marginTop: '-65px' }}
            >
              <Grid item lg={7} md={8} sm={11} xs={11}>
                <Card>
                  <CardContent>
                    <div className="text-center">
                      <Typography gutterBottom variant="h5" className="pt-4">
                        Fetching posts...
                      </Typography>
                      <CircularProgress className="mt-2" size={55} />
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        }
      />
    </>
  );
};

export default withSnackbar(Curation);
