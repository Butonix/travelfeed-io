import React, { Fragment, useEffect, useState } from 'react';
import ErrorPage from '../components/General/ErrorPage';
import Header from '../components/Header/Header';
import AuthorProfile from '../components/Profile/AuthorProfile';
import ProfileTabs from '../components/Profile/ProfileTabs';
import { getAccount } from '../helpers/steem';
import withApollo from '../lib/withApollo';

const BlogPage = props => {
  const [profile, setProfile] = useState(props.profile || {});

  const { author } = props;

  useEffect(() => {
    if (!props.profile)
      getAccount(author).then(pf => {
        if (pf) setProfile(pf);
      });
  }, []);

  const {
    display_name,
    cover_image,
    about,
    location,
    website,
    twitter,
    facebook,
    instagram,
    youtube,
    couchsurfing,
    pinterest,
  } = profile;

  return (
    <Fragment>
      {(author && (
        <>
          <AuthorProfile
            profile={{
              name: author,
              display_name,
              cover_image,
              about,
              location,
              website,
              twitter,
              facebook,
              instagram,
              youtube,
              couchsurfing,
              pinterest,
            }}
          />
          <ProfileTabs author={author} />
        </>
      )) || (
        <>
          <Header />
          <ErrorPage statusCode={404} />
        </>
      )}
    </Fragment>
  );
};

BlogPage.getInitialProps = async props => {
  let profile;
  const { author } = props.query;

  if (!process.browser) profile = await getAccount(author);

  return { author, profile };
};

export default withApollo(BlogPage);
