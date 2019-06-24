/* eslint-disable react/no-unescaped-entities */
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import InfiniteScroll from 'react-infinite-scroller';
import readingTime from 'reading-time';
import sanitize from 'sanitize-html';
import { imageProxy } from '../../helpers/getImage';
import { GET_BOOKMARKS } from '../../helpers/graphql/bookmarks';
import parseBody from '../../helpers/parseBody';
import { regExcerpt } from '../../helpers/regex';
import GridPostCard from '../Grid/GridPostCard';

class Bookmarks extends Component {
  state = {
    hasMore: true,
    postslength: 9,
  };

  noMore() {
    this.setState({ hasMore: false });
  }

  render() {
    const { hasMore, postslength } = this.state;
    return (
      <Fragment>
        <div className="text-center pt-4">
          <h1>Bookmarks</h1>
        </div>
        <Query query={GET_BOOKMARKS} variables={{ limit: 9 }}>
          {({ data, loading, error, fetchMore }) => {
            if (loading) {
              return (
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <div className="p-5 text-center">
                    <CircularProgress />
                  </div>
                </Grid>
              );
            }
            if (error || data.bookmarks === null) {
              return (
                <div className="text-center">
                  You don't have any bookmarks yet.
                </div>
              );
            }
            if (data.bookmarks.length < 9 && hasMore)
              this.setState({ hasMore: false });
            return (
              <InfiniteScroll
                loadMore={() => {
                  if (postslength === data.bookmarks.length) {
                    fetchMore({
                      variables: {
                        offset: data.bookmarks.length,
                      },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        if (fetchMoreResult.bookmarks.length < 9) {
                          this.noMore();
                        }
                        if (!fetchMoreResult) return prev;
                        return Object.assign({}, prev, {
                          bookmarks: [
                            ...prev.bookmarks,
                            ...fetchMoreResult.bookmarks,
                          ],
                        });
                      },
                    });
                    this.setState({ postslength: postslength + 9 });
                  }
                }}
                hasMore={hasMore}
                threshold={1000}
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
                  className="p-3"
                >
                  {data.bookmarks.length > 0 &&
                    data.bookmarks.map(post => {
                      const imgHeight = 600;
                      const htmlBody = parseBody(post.body, {});
                      const sanitized = sanitize(htmlBody, { allowedTags: [] });
                      const readtime = readingTime(sanitized);
                      const image = imageProxy(
                        post.img_url,
                        undefined,
                        imgHeight,
                      );
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
                      return (
                        <Grid
                          item
                          lg={4}
                          md={6}
                          sm={12}
                          xs={12}
                          key={post.permlink}
                        >
                          <GridPostCard
                            isBookmark
                            cardHeight={250}
                            post={{
                              author: post.author,
                              display_name: post.display_name,
                              permlink: post.permlink,
                              title,
                              img_url: image,
                              created_at: post.created_at,
                              readtime,
                              excerpt,
                              votes: post.votes,
                              total_votes: post.total_votes,
                              tags,
                              curation_score: post.curation_score,
                              app: post.app,
                              depth: post.depth,
                            }}
                          />
                        </Grid>
                      );
                    })}
                  {data.bookmarks && data.bookmarks.length === 0 && (
                    <Card className="mt-5">
                      <CardContent>
                        You don't have any bookmarks yet.
                      </CardContent>
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

export default Bookmarks;
