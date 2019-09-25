import CircularProgress from '@material-ui/core/CircularProgress';
import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import { GET_NOTIFICATIONS } from '../../helpers/graphql/posts';
import { getUser } from '../../helpers/token';
import CustomSnackbar from './Notifications/CustomSnackbar';

const Notifications = () => {
  return (
    <Fragment>
      <Query
        query={GET_NOTIFICATIONS}
        variables={{
          author: getUser(),
          min_curation_score: 5000,
          limit: 10,
        }}
      >
        {({ data, loading, error }) => {
          return (
            <Fragment>
              <div className="text-center w-100 pt-3">
                {loading && (
                  <div className="p-5 text-center">
                    <CircularProgress />
                  </div>
                )}
                {(error || (data && data.posts === null)) && (
                  <p>Error: Could not load notifications.</p>
                )}
                {data && data.posts && data.posts.length === 0 && (
                  <p>No notifications.</p>
                )}
                {data &&
                  data.posts &&
                  data.posts.length > 0 &&
                  data.posts.map(post => {
                    return post.curation_score >= 9000 ? (
                      <div
                        key={post.title}
                        className="d-flex justify-content-center p-2"
                      >
                        <CustomSnackbar
                          variant="success"
                          message={`Your post ${post.title}
                            was selected to be featured on the front page! Keep
                            up the great work!`}
                        />
                      </div>
                    ) : (
                      <div
                        key={post.title}
                        className="d-flex justify-content-center p-2"
                      >
                        <CustomSnackbar
                          variant="info"
                          message={`Your post ${post.title}
                            received a small vote by our curation team! Good job!`}
                        />
                      </div>
                    );
                  })}
              </div>
            </Fragment>
          );
        }}
      </Query>
    </Fragment>
  );
};

export default Notifications;
