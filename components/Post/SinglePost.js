/* eslint-disable no-shadow */
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import NextHead from 'next/head';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import readingTime from 'reading-time';
import sanitize from 'sanitize-html';
import LazyLoad from 'vanilla-lazyload';
import { GET_SETTINGS } from '../../helpers/graphql/settings';
import { GET_POST } from '../../helpers/graphql/singlePost';
import parseBody from '../../helpers/parseBody';
import { getUser } from '../../helpers/token';
import InvalidPost from '../General/InvalidPost';
import NotFound from '../General/NotFound';
import Head from '../Header/Head';
import Header from '../Header/Header';
import OrderBySelect from './OrderBySelect';
import PostCommentItem from './PostCommentItem';
import PostComments from './PostComments';
import PostContent from './PostContent';
import PostImageHeader from './PostImageHeader';
import PostSocialShares from './PostSocialShares';
import PostTitle from './PostTitle';
import VoteSlider from './VoteSlider';

class SinglePost extends Component {
  constructor(props) {
    super(props);
    this.myInput = React.createRef();
  }

  state = {
    title: 'Most miles',
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
    return (
      <Fragment>
        <Query query={GET_POST} variables={this.props.post}>
          {({ data, loading, error }) => {
            if (loading) {
              return (
                <Fragment>
                  <Header />
                  <Grid
                    container
                    spacing={0}
                    alignItems="center"
                    justify="center"
                    className="pt-4 pb-4"
                  >
                    <Grid item lg={7} md={8} sm={12} xs={12} />
                  </Grid>
                </Fragment>
              );
            }
            // 404 for error and if post does not exist
            if (error || data.post === null) {
              return (
                <Fragment>
                  <Header />
                  <Grid
                    container
                    spacing={0}
                    alignItems="center"
                    justify="center"
                    className="pt-4 pb-4"
                  >
                    <Grid item lg={7} md={8} sm={11} xs={12}>
                      <NotFound statusCode={404} />
                    </Grid>
                  </Grid>
                </Fragment>
              );
            }
            // Don't render invalid posts but return Steempeak link
            // Todo: Display NSFW posts for logged in users based on
            // prefererences
            if (!data.post.is_travelfeed && data.post.depth === 0) {
              const url = `https://steempeak.com/@${data.post.author}/${data.post.permlink}`;
              return <InvalidPost url={url} />;
            }
            // If comment, render comment component
            let card = <Fragment />;
            let head = <Fragment />;
            // Render post
            const htmlBody = parseBody(data.post.body, {
              cardWidth: this.state.cardWidth,
            });
            const bodyText = { __html: htmlBody };
            let bodycontent = (
              // eslint-disable-next-line react/no-danger
              <div
                className="textPrimary postcontent"
                dangerouslySetInnerHTML={bodyText}
              />
            );
            const isBacklisted = data.post.is_blacklisted;
            const isNSFW = data.post.is_nsfw;
            if (data.post.is_blacklisted || data.post.is_nsfw) {
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
                      return <p>This post has been removed from TravelFeed.</p>;
                    }
                    return (
                      <div
                        className="textPrimary postcontent"
                        // eslint-disable-next-line react/no-danger
                        dangerouslySetInnerHTML={bodyText}
                      />
                    );
                  }}
                </Query>
              );
            }
            const sanitized = sanitize(htmlBody, { allowedTags: [] });
            const readtime = readingTime(sanitized);
            const excerpt = `${sanitized.substring(0, 180)}[...] by ${
              data.post.author
            }`;
            // Set the canonical URL to steemit.com by default to avoid
            // duplicate content SEO problems
            let canonicalUrl = `https://steemit.com/travelfeed/@${data.post.author}/${data.post.permlink}`;
            let appIcon = <Fragment />;
            // Set the caninical URL to travelfeed.io if the post was authored
            // through the dApp
            if (data.post.app && data.post.app.split('/')[0] === 'travelfeed') {
              canonicalUrl = `https://travelfeed.io/@${data.post.author}/${data.post.permlink}`;
              appIcon = (
                <img
                  alt="TravelFeed"
                  width="25"
                  className="mr-1"
                  src="https://travelfeed.io/favicon.ico"
                />
              );
            }
            if (data.post.depth > 0) {
              head = (
                <Head
                  title={`Re: ${data.post.root_title} - TravelFeed`}
                  description={excerpt}
                  canonicalUrl={canonicalUrl}
                  type={{
                    type: 'article',
                    published_time: data.post.created_at,
                    author: data.post.display_name,
                    tags: data.post.tags,
                  }}
                />
              );
              card = (
                <PostCommentItem
                  loadreplies={false}
                  post={{
                    post_id: data.post.post_id,
                    body: data.post.body,
                    created_at: data.post.created_at,
                    children: data.post.children,
                    author: data.post.author,
                    display_name: data.post.display_name,
                    permlink: data.post.permlink,
                    depth: data.post.depth,
                    total_votes: data.post.total_votes,
                    votes: data.post.votes,
                    parent_author: data.post.parent_author,
                    parent_permlink: data.post.parent_permlink,
                    root_author: data.post.root_author,
                    root_permlink: data.post.root_permlink,
                    root_title: data.post.root_title,
                  }}
                  title
                />
              );
            } else {
              head = (
                <Head
                  title={`${data.post.title} - TravelFeed`}
                  image={data.post.img_url}
                  description={excerpt}
                  canonicalUrl={canonicalUrl}
                  type={{
                    type: 'article',
                    published_time: data.post.created_at,
                    author: data.post.display_name,
                    tags: data.post.tags,
                  }}
                />
              );
              card = (
                <>
                  <div ref={this.myInput}>
                    <Card>
                      <PostContent
                        author={data.post.author}
                        appIcon={appIcon}
                        permlink={data.post.permlink}
                        display_name={data.post.display_name}
                        created_at={data.post.created_at}
                        readtime={readtime}
                        content={bodycontent}
                        latitude={data.post.latitude}
                        longitude={data.post.longitude}
                      />
                      <VoteSlider
                        author={data.post.author}
                        permlink={data.post.permlink}
                        votes={data.post.votes}
                        total_votes={data.post.total_votes}
                        tags={data.post.tags}
                        depth={data.post.depth}
                        mode="post"
                        onCommentAdd={this.onCommentAdd}
                      />
                    </Card>
                  </div>
                  <div className="pt-2">
                    <Card>
                      <PostSocialShares
                        author={data.post.author}
                        permlink={data.post.permlink}
                        tags={data.post.tags}
                        title={data.post.title}
                        img_url={data.post.img_url}
                      />
                    </Card>
                  </div>
                </>
              );
            }
            // Don't load comment area  if there are no comments
            let comments = <Fragment />;
            if (data.post.children !== 0) {
              comments = (
                <Fragment>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <OrderBySelect
                      handleClick={this.handleClick}
                      selection={this.state.title || 'Most miles'}
                    />
                  </Grid>
                  <PostComments
                    post_id={data.post.post_id}
                    orderby={this.state.orderby || 'total_votes'}
                    orderdir={this.state.orderdir || 'DESC'}
                    ismain
                  />
                </Fragment>
              );
            }
            return (
              <Fragment>
                <NextHead>
                  <link rel="preconnect" href="https://maps.gstatic.com" />
                </NextHead>
                {head}
                <Header subheader={data.post.display_name} />
                <div style={{ position: 'relative' }}>
                  {data.post.depth === 0 && (
                    <PostImageHeader backgroundImage={data.post.img_url} />
                  )}
                  <div className="w-100" style={{ position: 'relative' }}>
                    <Grid
                      container
                      spacing={0}
                      alignItems="center"
                      justify="center"
                    >
                      <Grid item lg={7} md={8} sm={11} xs={12} className="pb-4">
                        {data.post.depth === 0 && (
                          <PostTitle title={data.post.title} />
                        )}
                        {data.post.depth !== 0 && (
                          <div className="container">
                            <div
                              className="row"
                              style={{
                                height: '50px',
                              }}
                            />
                          </div>
                        )}
                        {card}
                      </Grid>
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
                            <PostCommentItem
                              post={{
                                body: this.state.userComment.body,
                                created_at: new Date(),
                                children: 0,
                                author: getUser(),
                                display_name: '',
                                permlink: this.state.userComment.permlink,
                                depth: this.props.post.depth + 1,
                                total_votes: 0,
                                votes: '',
                                parent_author: '',
                                parent_permlink: '',
                                root_title: '',
                              }}
                            />
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

export default SinglePost;
