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
              <div className="container pb-3">
                <div className="row row justify-content-center">
                  <div className="col-xl-8 col-lg-8 col-md-9 col-sm-10 col-12">
                    {loading && (
                      <div className="p-5 text-center">
                        <CircularProgress />
                      </div>
                    )}
                    {(error || (data && data.posts === null)) && (
                      <div className="p-3 text-center">
                        Error: Could not load notifications.
                      </div>
                    )}
                    {data && data.posts && data.posts.length === 0 && (
                      <div className="p-3 text-center">No notifications.</div>
                    )}
                    {data &&
                      data.posts &&
                      data.posts.length > 0 &&
                      data.posts.map(post => {
                        return post.curation_score >= 9000 ? (
                          <div key={post.title} className="pt-3">
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
                </div>
              </div>
            </Fragment>
          );
        }}
      </Query>
    </Fragment>
  );
};

export default Notifications;
