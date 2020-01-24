/* eslint-disable no-shadow */
import { useQuery } from '@apollo/react-hooks';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';
import readingTime from 'reading-time';
import sanitize from 'sanitize-html';
import canonicalLinker from '../../helpers/canonicalLinker';
import cleanTags from '../../helpers/cleanTags';
import { imageProxy } from '../../helpers/getImage';
import { GET_POST } from '../../helpers/graphql/singlePost';
import parseBody from '../../helpers/parseBody';
import parseHtmlToReact from '../../helpers/parseHtmlToReact';
import { getUser } from '../../helpers/token';
import supportsWebp from '../../helpers/webp';
import ErrorPage from '../General/ErrorPage';
import Head from '../Header/Head';
import Header from '../Header/Header';
import PostMap from '../Maps/PostMap';
import PostAuthorProfile from '../Profile/PostAuthorProfile';
import LightboxCaption from './LightboxCaption';
import OrderBySelect from './OrderBySelect';
import PostCommentItem from './PostCommentItem';
import PostComments from './PostComments';
import PostContent from './PostContent';
import PostImageHeader from './PostImageHeader';
import PostSocialShares from './PostSocialShares';
import PostTitle from './PostTitle';
import SimilarPosts from './SimilarPosts';
import SliderTags from './SliderTags';
import StickyVoteSlider from './StickyVoteSlider';
import VoteDetailsBtn from './VoteDetailsBtn';

const styles = () => ({
  card: {
    borderRadius: 12,
  },
});

const SinglePost = props => {
  const [webpSupport, setWebpSupport] = useState(undefined);
  const [cardWidth, setCardWidth] = useState(800);
  const [state, setState] = useState({
    title: 'Most smiles',
    orderby: 'total_votes',
    orderdir: 'DESC',
    userComment: undefined,
    lightboxIsOpen: false,
    lightboxIndex: 0,
  });

  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.offsetWidth) {
      const newCardWidth =
        Math.round((ref.current.offsetWidth + 100) / 100) * 100;
      setCardWidth(newCardWidth);
    }
    const getWebpSupport = async () => {
      const isWebp = await supportsWebp();
      return isWebp;
    };
    const webp = getWebpSupport();
    setWebpSupport(webp);
  }, []);

  const toggleModal = () => {
    setState(state => ({ lightboxIsOpen: !state.lightboxIsOpen }));
  };

  const toggleLightbox = lightboxIndex => {
    setState(state => ({
      lightboxIsOpen: !state.lightboxIsOpen,
      lightboxIndex,
    }));
  };

  const handleClick = op => {
    setState(op);
  };

  const onCommentAdd = userComment => {
    setState({ userComment });
  };

  const { lightboxIsOpen } = state;

  const { classes } = props;

  let children = 0;
  let is_travelfeed;
  let is_blacklisted;
  let is_nsfw;
  let root_title;
  let tags;
  let latitude;
  let longitude;
  let votes;
  let total_votes;
  let post_id;
  let parent_author;
  let parent_permlink;
  let root_author;
  let root_permlink;
  let json;
  let category;

  let {
    author,
    permlink,
    title,
    body,
    display_name,
    img_url,
    created_at,
    depth,
    country_code,
    subdivision,
    app,
    curation_score,
  } = props.post;
  const { lazy_img_url } = props.post;
  if (depth) depth = parseInt(depth, 10);
  if (!body) body = '';
  const { data, error } = useQuery(GET_POST, {
    variables: props.post,
  });
  if (data && data.post && data.post.permlink) {
    is_travelfeed = data.post.is_travelfeed;
    depth = data.post.depth;
    is_blacklisted = data.post.is_blacklisted;
    is_nsfw = data.post.is_nsfw;
    app = data.post.app;
    root_title = data.post.root_title;
    tags = data.post.tags;
    latitude = data.post.latitude;
    longitude = data.post.longitude;
    votes = data.post.votes;
    total_votes = data.post.total_votes;
    post_id = data.post.post_id;
    children = data.post.children;
    parent_author = data.post.parent_author;
    parent_permlink = data.post.parent_permlink;
    root_author = data.post.root_author;
    root_permlink = data.post.root_permlink;
    author = data.post.author;
    permlink = data.post.permlink;
    title = data.post.title;
    body = data.post.body;
    display_name = data.post.display_name;
    img_url = data.post.img_url;
    created_at = data.post.created_at;
    country_code = data.post.country_code;
    subdivision = data.post.subdivision;
    json = data.post.json;
    category = data.post.category;
    curation_score = data.post.curation_score;
  }
  const isTf = app ? app.split('/')[0] === 'travelfeed' : false;
  tags = tags ? cleanTags(tags) : tags;
  // 404 for error and if post does not exist
  if (data && data.post && data.post.post_id === null) {
    return (
      <>
        <Header />
        <ErrorPage statusCode={404} />
      </>
    );
  }
  if (error && body === '')
    body = 'Error: Could not load post. Are you online?';
  // Don't render invalid posts but return Steempeak link
  if (data && data.post && !is_travelfeed && depth === 0) {
    const url = `https://steempeak.com/@${author}/${permlink}`;
    return (
      <>
        <Header />
        <ErrorPage statusCode="invalid_post" url={url} />
      </>
    );
  }
  // Render post
  const htmlBody = parseBody(body, {});
  const reactParsed = parseHtmlToReact(htmlBody, {
    cardWidth,
    hideimgcaptions: !isTf,
    toggleLightbox,
    webpSupport,
  });
  const { bodyText, images } = reactParsed;
  const sanitized = sanitize(htmlBody, { allowedTags: [] });
  const readtime = readingTime(sanitized);
  const excerpt = `${sanitized.substring(0, 180)}[...] by ${author}`;
  const canonicalUrl = canonicalLinker(json, app, category, author, permlink);

  let bodycontent = (
    <div className="textPrimary postcontent postCardContent">{bodyText}</div>
  );

  if (is_nsfw) {
    bodycontent = (
      <p>This post has been marked as NSFW. TODO: Button to view post</p>
    );
  }

  if (is_blacklisted) {
    bodycontent = (
      <div className="textPrimary postcontent postCardContent">
        This post has been removed from TravelFeed.
      </div>
    );
  }

  return (
    <Fragment>
      <Head
        shorttitle={title}
        image={img_url}
        description={excerpt}
        canonicalUrl={canonicalUrl}
        type={{
          type: 'article',
          published_time: created_at,
          author: display_name,
          tags,
        }}
      />
      <Header
        active="post"
        socialShare={{ author, permlink, tags, title, img_url }}
      />
      <div style={{ position: 'relative' }}>
        {depth > 0 ? (
          <>
            <Head
              shorttitle={`Re: ${root_title}`}
              description={excerpt}
              canonicalUrl={canonicalUrl}
              type={{
                type: 'article',
                published_time: created_at,
                author: display_name,
                tags,
              }}
            />
            <div className="w-100" style={{ position: 'relative' }}>
              <Grid container spacing={0} alignItems="center" justify="center">
                <Grid item lg={6} md={7} sm={10} xs={12} className="pb-4">
                  <div className="pt-2 pr-2 pl-2">
                    <PostCommentItem
                      loadreplies={false}
                      post={{
                        post_id,
                        body,
                        created_at,
                        children,
                        author,
                        display_name,
                        permlink,
                        depth,
                        total_votes,
                        votes,
                        parent_author,
                        parent_permlink,
                        root_author,
                        root_permlink,
                        root_title,
                      }}
                      title
                    />
                  </div>
                </Grid>
              </Grid>
            </div>
          </>
        ) : (
          <>
            {img_url && (
              <PostImageHeader
                lazyImage={
                  lazy_img_url || imageProxy(img_url, undefined, 10, 'fit')
                }
                backgroundImage={img_url}
                author={author}
                permlink={permlink}
                tags={tags}
                title={title}
                img_url={img_url}
                comments={children}
              />
            )}
            <div className="w-100" style={{ position: 'relative' }}>
              <Grid container spacing={0} alignItems="center" justify="center">
                <Grid item lg={6} md={7} sm={10} xs={12} className="pb-4">
                  <PostTitle title={title} />
                  <div ref={ref} id="post">
                    <Card className={classes.card}>
                      <PostContent
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
                      {data && data.post && tags && tags.length > 0 && (
                        <>
                          <Divider variant="middle" />
                          <SliderTags tags={tags} />
                        </>
                      )}
                      {data && data.post && (
                        <div className="d-none d-xl-none d-lg-none d-sm-none d-md-block">
                          <Divider variant="middle" />
                          <Typography
                            variant="h5"
                            className="pt-4"
                            align="center"
                            gutterBottom
                          >
                            Share this post
                          </Typography>
                          <PostSocialShares
                            author={author}
                            permlink={permlink}
                            tags={tags}
                            title={title}
                            img_url={img_url}
                          />
                        </div>
                      )}
                      {latitude && (
                        <>
                          <Divider variant="middle" />
                          <div className="fullwidth">
                            <Typography
                              variant="h5"
                              className="p-2"
                              align="center"
                              gutterBottom
                            >
                              Post Location
                            </Typography>
                            <PostMap
                              cardWidth={cardWidth}
                              latitude={latitude}
                              longitude={longitude}
                            />
                          </div>
                        </>
                      )}
                      <div className="postCardContent">
                        <Divider variant="middle" />
                      </div>
                      <div className="container">
                        <div className="row justify-content-center">
                          <div className="col-lg-6 col-md-9 col-sm12">
                            <div className="text-center">
                              <Typography
                                variant="h5"
                                align="center"
                                className="p-2"
                                gutterBottom
                              >
                                Written by
                              </Typography>
                              <div className="pb-3">
                                <PostAuthorProfile
                                  author={author}
                                  display_name={display_name}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pb-4">
                        <VoteDetailsBtn
                          numberreplies={children}
                          votes={votes}
                          total_votes={total_votes}
                        />
                      </div>
                    </Card>
                  </div>
                </Grid>
                {votes !== undefined && (
                  <StickyVoteSlider
                    author={author}
                    permlink={permlink}
                    votes={votes}
                    total_votes={total_votes}
                    children={children}
                    mode="gridcard"
                    depth={depth}
                    onCommentAdd={onCommentAdd}
                  />
                )}

                <Grid item lg={11} md={11} sm={11} xs={12} className="pb-5">
                  <div className="pt-2">
                    {country_code && (
                      <SimilarPosts country_code={country_code} />
                    )}
                  </div>
                </Grid>
              </Grid>
            </div>
          </>
        )}
        <Grid container spacing={0} alignItems="center" justify="center">
          <Grid item lg={6} md={7} sm={11} xs={12} className="pb-2">
            <div className="anchor" id="comments" name="comments" />
            <div className="container">
              <div className="row">
                <div className="col">
                  <Typography
                    variant="h5"
                    className="p-2 d-inline"
                    gutterBottom
                  >
                    Comments
                  </Typography>
                </div>
                <div className="col">
                  <OrderBySelect
                    handleClick={handleClick}
                    selection={state.title || 'Most smiles'}
                  />
                </div>
              </div>
            </div>
            {// "Fake" display new user comment after submitting comment without refreshing from the API
            state.userComment && (
              <Grid item lg={12} md={12} sm={12} xs={12} className="pb-2">
                <div className="pt-2 pr-2 pl-2">
                  <PostCommentItem
                    post={{
                      body: state.userComment.body,
                      created_at: new Date(),
                      children: 0,
                      author: getUser(),
                      display_name: '',
                      permlink: state.userComment.permlink,
                      depth: depth + 1,
                      total_votes: 0,
                      votes: '',
                      parent_author: author,
                      parent_permlink: permlink,
                      root_title: '',
                    }}
                  />
                </div>
              </Grid>
            )}
            {children !== 0 && (
              <Fragment>
                <div className="pr-2 pl-2">
                  <PostComments
                    hideCommentNumber
                    post_id={post_id}
                    orderby={state.orderby || 'total_votes'}
                    orderdir={state.orderdir || 'DESC'}
                    ismain
                  />
                </div>
              </Fragment>
            )}
          </Grid>
        </Grid>
      </div>
      {images && (
        <ModalGateway>
          {lightboxIsOpen ? (
            <Modal onClose={toggleModal} closeOnBackdropClick>
              <Carousel
                views={images}
                currentIndex={state.lightboxIndex}
                components={{ LightboxCaption }}
              />
            </Modal>
          ) : null}
        </ModalGateway>
      )}
    </Fragment>
  );
};

export default withStyles(styles)(SinglePost);
