/* eslint-disable no-shadow */
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import readingTime from 'reading-time';
import sanitize from 'sanitize-html';
import LazyLoad from 'vanilla-lazyload';
import canonicalLinker from '../../helpers/canonicalLinker';
import cleanTags from '../../helpers/cleanTags';
import { imageProxy } from '../../helpers/getImage';
import { GET_SETTINGS } from '../../helpers/graphql/settings';
import { GET_POST } from '../../helpers/graphql/singlePost';
import parseBody from '../../helpers/parseBody';
import parseHtmlToReact from '../../helpers/parseHtmlToReact';
import { getUser } from '../../helpers/token';
import ErrorPage from '../General/ErrorPage';
import Head from '../Header/Head';
import Header from '../Header/Header';
import PostMap from '../Maps/PostMap';
import PostAuthorProfile from '../Profile/PostAuthorProfile';
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

const styles = () => ({
  card: {
    borderRadius: 12,
  },
});

class SinglePost extends Component {
  constructor(props) {
    super(props);
    this.myInput = React.createRef();
  }

  state = {
    title: 'Most smiles',
    orderby: 'total_votes',
    orderdir: 'DESC',
    userComment: undefined,
    cardWidth: 800,
  };

  componentDidMount() {
    if (this.myInput.current) {
      const cardWidth =
        Math.round((this.myInput.current.offsetWidth + 100) / 100) * 100;
      this.setState({ cardWidth });
    }
    if (!document.lazyLoadInstance) {
      document.lazyLoadInstance = new LazyLoad({
        elements_selector: '.lazy',
        threshold: 1200,
      });
    }
    // Update lazyLoad after first rendering of every image
    document.lazyLoadInstance.update();
    if (this.props.post.scrollToComments) {
      const comments = document.getElementById('comments');
      const topPos = comments.offsetTop;
      document.getElementById('__next').scrollTop = topPos;
    }
  }

  // Update lazyLoad after rerendering of every image
  componentDidUpdate() {
    document.lazyLoadInstance.update();
  }

  handleClick = op => {
    this.setState(op);
  };

  onCommentAdd = userComment => {
    this.setState({ userComment });
  };

  render() {
    const { classes } = this.props;

    let children = 0;
    let is_travelfeed,
      is_blacklisted,
      is_nsfw,
      root_title,
      tags,
      latitude,
      longitude,
      votes,
      total_votes,
      post_id,
      parent_author,
      parent_permlink,
      root_author,
      root_permlink,
      json,
      category;

    let {
      author,
      permlink,
      title,
      body,
      display_name,
      img_url,
      lazy_img_url,
      created_at,
      depth,
      country_code,
      subdivision,
      app,
      curation_score,
    } = this.props.post;
    if (depth) depth = parseInt(depth, 10);
    if (!body) body = '';
    const isTf = app && app.split('/')[0] === 'travelfeed';
    let titleUri = '';
    let bodyUri = '';
    let displayNameUri = '';
    try {
      titleUri = encodeURIComponent(this.props.post.title);
    } catch {
      console.warn('Could not encode URI');
    }
    try {
      bodyUri = encodeURIComponent(this.props.post.body);
    } catch {
      console.warn('Could not encode URI');
    }
    try {
      displayNameUri = encodeURIComponent(this.props.post.display_name);
    } catch {
      console.warn('Could not encode URI');
    }
    return (
      <Fragment>
        <Query query={GET_POST} variables={this.props.post}>
          {({ data, error }) => {
            if (data && data.post) {
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
            tags = cleanTags(tags);
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
            // Todo: Display NSFW posts for logged in users based on
            // prefererences
            if (data && data.post && !is_travelfeed && depth === 0) {
              const url = `https://steempeak.com/@${author}/${permlink}`;
              return (
                <>
                  <Header />
                  <ErrorPage statusCode="invalid_post" url={url} />
                </>
              );
            }
            // If comment, render comment component
            let card = <Fragment />;
            let head = <Fragment />;
            // Render post
            const htmlBody = parseBody(body, {});
            const bodyText = parseHtmlToReact(htmlBody, {
              cardWidth: this.state.cardWidth,
              hideimgcaptions: !isTf,
            });
            let bodycontent = (
              // eslint-disable-next-line react/no-danger
              <div className="textPrimary postcontent postCardContent">
                {bodyText}
              </div>
            );
            const isBacklisted = is_blacklisted;
            const isNSFW = is_nsfw;
            if (is_blacklisted || is_nsfw) {
              bodycontent = (
                <Query query={GET_SETTINGS}>
                  {({ data, loading, error }) => {
                    if (loading || error) {
                      return <Fragment />;
                    }
                    if (isNSFW && data && !data.preferences.showNSFW) {
                      return (
                        <p>
                          This post has been marked as NSFW. To view it, you
                          need to adjust your preferences.
                        </p>
                      );
                    }
                    if (isBacklisted && data.preferences.useTfBlacklist) {
                      return (
                        <div className="textPrimary postcontent postCardContent">
                          This post has been removed from TravelFeed.
                        </div>
                      );
                    }
                    return (
                      <div className="textPrimary postcontent postCardContent">
                        {bodyText}
                      </div>
                    );
                  }}
                </Query>
              );
            }
            const sanitized = sanitize(htmlBody, { allowedTags: [] });
            const readtime = readingTime(sanitized);
            const excerpt = `${sanitized.substring(0, 180)}[...] by ${author}`;
            const canonicalUrl = canonicalLinker(
              json,
              app,
              category,
              author,
              permlink,
            );
            // Set the caninical URL to travelfeed.io if the post was authored
            // through the dApp
            if (depth > 0) {
              head = (
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
              );
              card = (
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
              );
            } else {
              head = (
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
              );
              card = (
                <>
                  <div ref={this.myInput} id="post">
                    <Card className={classes.card}>
                      <PostContent
                        author={author}
                        isTf={isTf}
                        permlink={permlink}
                        display_name={display_name}
                        created_at={created_at}
                        readtime={readtime}
                        content={bodycontent}
                        latitude={latitude}
                        longitude={longitude}
                        country_code={country_code}
                        subdivision={subdivision}
                        tags={tags}
                        curationScore={curation_score}
                        title={title}
                        img_url={img_url}
                      />
                      {data && data.post && <SliderTags tags={tags} />}
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
                              cardWidth={this.state.cardWidth}
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
                                <PostAuthorProfile author={author} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pt-4" />
                    </Card>
                  </div>
                </>
              );
            }
            // Don't load comment area  if there are no comments
            let comments = (
              <div className="anchor" id="comments" name="comments" />
            );
            if (children !== 0) {
              comments = (
                <Fragment>
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
                          handleClick={this.handleClick}
                          selection={this.state.title || 'Most smiles'}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pr-2 pl-2">
                    <PostComments
                      post_id={post_id}
                      orderby={this.state.orderby || 'total_votes'}
                      orderdir={this.state.orderdir || 'DESC'}
                      ismain
                    />
                  </div>
                </Fragment>
              );
            }
            return (
              <Fragment>
                {head}
                <Header
                  active="post"
                  socialShare={{ author, permlink, tags, title, img_url }}
                />
                <div style={{ position: 'relative' }}>
                  {depth === 0 && img_url && (
                    <PostImageHeader
                      lazyImage={
                        lazy_img_url ||
                        imageProxy(img_url, undefined, 10, 'fit')
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
                    <Grid
                      container
                      spacing={0}
                      alignItems="center"
                      justify="center"
                    >
                      <Grid item lg={7} md={9} sm={11} xs={12} className="pb-4">
                        {depth === 0 && <PostTitle title={title} />}
                        {card}
                      </Grid>
                      {depth === 0 && (
                        <StickyVoteSlider
                          commentLink={`/post?author=${author}&permlink=${permlink}&title=${titleUri}&body=${bodyUri}&display_name=${displayNameUri}&img_url=${encodeURIComponent(
                            img_url,
                          )}&lazy_img_url=${encodeURIComponent(
                            lazy_img_url,
                          )}&created_at=${encodeURIComponent(
                            created_at,
                          )}&depth=0&country_code=${country_code}&subdivision=${encodeURIComponent(
                            subdivision,
                          )}&app=${encodeURIComponent(
                            app,
                          )}&curation_score=${encodeURIComponent(
                            curation_score,
                          )}`}
                          author={author}
                          permlink={permlink}
                          votes={votes}
                          total_votes={total_votes}
                          children={children}
                          mode="gridcard"
                          depth={depth}
                          onCommentAdd={this.onCommentAdd}
                        />
                      )}
                      {depth === 0 && (
                        <Grid
                          item
                          lg={11}
                          md={11}
                          sm={11}
                          xs={12}
                          className="pb-5"
                        >
                          <div className="pt-2">
                            {country_code && (
                              <SimilarPosts country_code={country_code} />
                            )}
                          </div>
                        </Grid>
                      )}
                      <Grid item lg={6} md={7} sm={11} xs={12} className="pb-2">
                        {// "Fake" display new user comment after submitting comment without refreshing from the API
                        this.state.userComment && (
                          <Grid
                            item
                            lg={12}
                            md={12}
                            sm={12}
                            xs={12}
                            className="pb-2"
                          >
                            <div className="pt-2 pr-2 pl-2">
                              <PostCommentItem
                                post={{
                                  body: this.state.userComment.body,
                                  created_at: new Date(),
                                  children: 0,
                                  author: getUser(),
                                  display_name: '',
                                  permlink: this.state.userComment.permlink,
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
                        {comments}
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </Fragment>
            );
          }}
        </Query>
      </Fragment>
    );
  }
}

SinglePost.propTypes = {
  post: PropTypes.objectOf(PropTypes.string, PropTypes.number).isRequired,
};

export default withStyles(styles)(SinglePost);
