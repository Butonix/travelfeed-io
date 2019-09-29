import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import InfiniteScroll from 'react-infinite-scroller';
import readingTime from 'reading-time';
import sanitize from 'sanitize-html';
import { GET_DRAFTS } from '../../helpers/graphql/drafts';
import json2md from '../../helpers/json2md';
import parseBody from '../../helpers/parseBody';
import { regExcerpt } from '../../helpers/regex';
import { getUser } from '../../helpers/token';
import PostListItem from '../Grid/PostListItem';

class Drafts extends Component {
  state = {
    hasMore: true,
    postslength: 10,
  };

  noMore() {
    this.setState({ hasMore: false });
  }

  render() {
    const { hasMore, postslength } = this.state;
    const user = getUser();
    return (
      <Fragment>
        <div className="text-center pt-1" />
        <Query
          fetchPolicy="network-only"
          query={GET_DRAFTS}
          variables={{ limit: 10 }}
        >
          {({ data, loading, error, fetchMore }) => {
            if (loading) {
              return (
                <div className="col-12 p-5 text-center">
                  <CircularProgress />
                </div>
              );
            }
            if (error || data.drafts === null) {
              return <Fragment />;
            }
            if (data.drafts.length < 10 && hasMore)
              this.setState({ hasMore: false });
            return (
              <InfiniteScroll
                loadMore={() => {
                  if (postslength === data.drafts.length) {
                    fetchMore({
                      variables: {
                        offset: data.drafts.length,
                      },
                      updateQuery: (prev, { fetchMoreResult }) => {
                        if (fetchMoreResult.drafts.length < 10) {
                          this.noMore();
                        }
                        if (!fetchMoreResult) return prev;
                        return Object.assign({}, prev, {
                          drafts: [...prev.drafts, ...fetchMoreResult.drafts],
                        });
                      },
                    });
                    this.setState({ postslength: postslength + 10 });
                  }
                }}
                hasMore={hasMore}
                threshold={1000}
                loader={
                  <div className="col-12 p-5 text-center" key="loader">
                    <CircularProgress />
                  </div>
                }
              >
                <Grid
                  container
                  spacing={0}
                  alignItems="center"
                  justify="center"
                >
                  <Grid item lg={8} md={10} sm={11} xs={12}>
                    {data.drafts.length > 0 &&
                      data.drafts.map(draft => {
                        const htmlBody = parseBody(
                          draft.isCodeEditor === false
                            ? json2md(JSON.parse(draft.body))
                            : draft.body,
                          {},
                        );
                        const sanitized = sanitize(htmlBody, {
                          allowedTags: [],
                        });
                        const readtime = readingTime(sanitized);
                        const excerpt = regExcerpt(sanitized);
                        return (
                          <PostListItem
                            key={draft.id}
                            post={{
                              author: user,
                              body: draft.body,
                              display_name: user,
                              title: draft.title,
                              isCodeEditor: draft.isCodeEditor,
                              json: draft.json,
                              created_at: draft.savedate,
                              readtime,
                              excerpt,
                              id: draft.id,
                            }}
                            id={draft.id}
                            isDraftMode
                          />
                        );
                      })}
                  </Grid>
                  {data.drafts && data.drafts.length === 0 && (
                    <Card className="mt-2">
                      <CardContent>
                        You don&apos;t have any drafts yet.
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

export default Drafts;
