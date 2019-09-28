// https://medium.com/@alfianlosari/graphql-cursor-infinite-scroll-pagination-with-react-apollo-client-and-github-api-fafbc510b667
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import InfiniteScroll from 'react-infinite-scroller';
import readingTime from 'reading-time';
import sanitize from 'sanitize-html';
import { GET_POSTS } from '../../helpers/graphql/posts';
import parseBody from '../../helpers/parseBody';
import { regExcerpt } from '../../helpers/regex';
import PostCommentItem from '../Post/PostCommentItem';
import GridPostCard from './GridPostCard';
import PostListItem from './PostListItem';

class PostGrid extends Component {
  state = {
    hasMore: true,
    postslength: this.props.query.limit,
  };

  // When switching between different props, e.g. feed/featured/created/ the
  // count needs to be reset
  UNSAFE_componentWillReceiveProps() {
    this.setState({ postslength: this.props.query.limit });
  }

  noMore() {
    this.setState({ hasMore: false });
  }

  render() {
    return (
      <Fragment>
        <Query query={GET_POSTS} variables={this.props.query}>
          {({ data, loading, error, fetchMore }) => {
            if (loading) {
              return (
                <Grid item lg={12} md={12} sm={12} xs={12} key={0}>
                  <div className="p-5 text-center">
                    <CircularProgress />
                  </div>
                </Grid>
              );
            }
            if (error || data.posts === null) {
              return <Fragment />;
            }
            if (
              data.posts.length < this.props.query.limit &&
              this.state.hasMore
            )
              this.setState({ hasMore: false });
            return (
              <InfiniteScroll
                loadMore={() => {
                  if (this.state.postslength === data.posts.length) {
                    fetchMore({
                      variables: {
                        offset: data.posts ? data.posts.length : 0,
                        limit: this.props.query.limit,
                      },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        if (
                          fetchMoreResult.posts.length < this.props.query.limit
                        ) {
                          this.noMore();
                        }
                        if (!fetchMoreResult) return prev;
                        return Object.assign({}, prev, {
                          posts: [...prev.posts, ...fetchMoreResult.posts],
                        });
                      },
                    });
                    this.setState(prevState => ({
                      postslength:
                        prevState.postslength + this.props.query.limit,
                    }));
                  } else if (
                    this.state.postslength !==
                    data.posts.length + this.props.query.limit
                  ) {
                    // When switching between different props, e.g.
                    // feed/featured/created/ and switching back, this fix is
                    // needed.
                    // There should be a better way though..
                    this.setState({
                      postslength: data.posts.length,
                    });
                  }
                }}
                hasMore={this.state.hasMore}
                threshold={800}
                loader={
                  <Grid item lg={12} md={12} sm={12} xs={12} key="loader">
                    <div className="p-5 text-center">
                      <CircularProgress />
                    </div>
                  </Grid>
                }
              >
                <Grid
                  container
                  spacing={0}
                  alignItems="center"
                  justify="center"
                >
                  {data.posts &&
                    data.posts.length > 0 &&
                    data.posts.map(post => {
                      if (post.is_blacklisted)
                        return <Fragment key={post.id} />;
                      const htmlBody = parseBody(post.body, {});
                      const sanitized = sanitize(htmlBody, { allowedTags: [] });
                      const readtime = readingTime(sanitized);
                      let { title } = post;
                      title =
                        title.length > 85
                          ? `${title.substring(0, 81)}[...]`
                          : title;
                      const tags =
                        post.tags && post.tags.length > 1
                          ? [post.tags[1]]
                          : ['travelfeed'];
                      const excerpt = regExcerpt(sanitized);
                      let card = <Fragment />;
                      if (this.props.poststyle === 'list') {
                        card = (
                          <PostListItem
                            post={{
                              author: post.author,
                              body: post.body,
                              display_name: post.display_name,
                              permlink: post.permlink,
                              title: post.title,
                              img_url: post.img_url,
                              latitude: post.latitude,
                              longitude: post.longitude,
                              created_at: post.created_at,
                              readtime: post.readtime,
                              excerpt,
                              votes: post.votes,
                              total_votes: post.total_votes,
                              tags: post.tags,
                              curation_score: post.curation_score,
                              app: post.app,
                              parent_author: post.parent_author,
                              parent_permlink: post.parent_permlink,
                              payout: post.payout,
                              country_code: post.country_code,
                              subdivision: post.subdivision,
                              json: post.json,
                              category: post.category,
                            }}
                            id={`${post.author}-${post.permlink}`}
                            mode="edit"
                          />
                        );
                      } else if (this.props.poststyle === 'comment') {
                        card = (
                          <PostCommentItem
                            post={{
                              post_id: post.post_id,
                              body: post.body,
                              created_at: post.created_at,
                              children: post.children,
                              author: post.author,
                              display_name: post.display_name,
                              permlink: post.permlink,
                              depth: post.depth,
                              total_votes: post.total_votes,
                              votes: post.votes,
                              parent_author: post.parent_author,
                              parent_permlink: post.parent_permlink,
                              root_author: post.root_author,
                              root_permlink: post.root_permlink,
                              root_title: post.root_title,
                              tags: 'travelfeed',
                            }}
                            loadreplies={false}
                            title
                          />
                        );
                      } else {
                        card = (
                          <GridPostCard
                            cardHeight={this.props.cardHeight}
                            post={{
                              body: post.body,
                              author: post.author,
                              display_name: post.display_name,
                              permlink: post.permlink,
                              title,
                              img_url: post.img_url,
                              created_at: post.created_at,
                              readtime,
                              excerpt,
                              votes: post.votes,
                              total_votes: post.total_votes,
                              tags,
                              curation_score: post.curation_score,
                              app: post.app,
                              depth: post.depth,
                              country_code: post.country_code,
                              subdivision: post.subdivision,
                            }}
                          />
                        );
                      }
                      return (
                        <Grid
                          item
                          lg={this.props.grid.lg}
                          md={this.props.grid.md}
                          sm={this.props.grid.sm}
                          xs={this.props.grid.xs}
                          key={post.id}
                        >
                          {card}
                        </Grid>
                      );
                    })}
                  {data.posts &&
                    data.posts.length === 0 &&
                    this.props.poststyle === 'grid' && (
                      <Card className="mt-5" key="noposts">
                        <CardContent>No posts found</CardContent>
                      </Card>
                    )}
                </Grid>
              </InfiniteScroll>
            );
          }}
        </Query>
      </Fragment>
    );
  }
}

PostGrid.defaultProps = {
  cardHeight: undefined,
};

PostGrid.propTypes = {
  query: PropTypes.objectOf(PropTypes.any).isRequired,
  cardHeight: PropTypes.number,
  poststyle: PropTypes.string.isRequired,
  grid: PropTypes.objectOf(PropTypes.number).isRequired,
};

export default PostGrid;
