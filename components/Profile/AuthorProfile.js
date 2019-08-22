import '@fortawesome/fontawesome-svg-core/styles.css';
import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import { GET_PROFILE } from '../../helpers/graphql/profile';
import NotFound from '../General/NotFound';
import Head from '../Header/Head';
import Header from '../Header/Header';
import AuthorProfileBar from './AuthorProfileBar';
import AuthorProfileHeader from './AuthorProfileHeader';
import FollowButton from './FollowButton';

const AuthorProfile = props => {
  return (
    <Fragment>
      <Query query={GET_PROFILE} variables={props}>
        {({ data, loading, error }) => {
          if (loading) {
            return <Header />;
          }
          if (error || data.profile === null) {
            return (
              <Fragment>
                <Header />
                <NotFound statusCode={404} />
              </Fragment>
            );
          }
          const about = data.profile.about !== '' ? data.profile.about : '';

          return (
            <Fragment>
              <Head
                title={`${data.profile.display_name}'s Blog on TravelFeed: The Travel Community`}
                image={data.profile.img_url}
                description={`${data.profile.display_name}'s Blog: ${about}`}
                type={{
                  type: 'profile',
                  display_name: data.profile.display_name,
                  username: data.profile.name,
                }}
              />
              <Header subheader={data.profile.display_name} />
              <AuthorProfileHeader
                data={{
                  name: data.profile.name,
                  display_name: data.profile.display_name,
                  isBlacklisted: data.profile.isBlacklisted,
                  isCurator: data.profile.isCurator,
                  about: data.profile.about,
                  cover_image: data.profile.cover_image,
                }}
                moreContent={
                  <>
                    <div className="col-12 pt-3">
                      <FollowButton
                        author={data.profile.name}
                        isFollowed={data.profile.isFollowed}
                        isIgnored={data.profile.isIgnored}
                        btnstyle="solid"
                      />
                    </div>
                    <div className="col-12 pt-4 pb-3">
                      <AuthorProfileBar
                        location={data.profile.location}
                        website={data.profile.website}
                        facebook={data.profile.facebook}
                        twitter={data.profile.twitter}
                        instagram={data.profile.instagram}
                        youtube={data.profile.youtube}
                        couchsurfing={data.profile.couchsurfing}
                      />
                    </div>
                  </>
                }
              />
            </Fragment>
          );
        }}
      </Query>
    </Fragment>
  );
};

export default AuthorProfile;
