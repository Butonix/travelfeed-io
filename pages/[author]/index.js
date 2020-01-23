import { getDataFromTree } from '@apollo/react-ssr';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import ErrorPage from '../../components/General/ErrorPage';
import Header from '../../components/Header/Header';
import AuthorProfile from '../../components/Profile/AuthorProfile';
import ProfileTabs from '../../components/Profile/ProfileTabs';
import { getAccount } from '../../helpers/steem';
import withApollo from '../../lib/withApollo';

const BlogPage = props => {
  const router = useRouter();

  if (!router.query.author || !router.query.author.match(/@/)) {
    return (
      <>
        <Header />
        <ErrorPage statusCode={404} />
      </>
    );
  }

  const author = router.query.author.replace(/@/, '');

  const [profile, setProfile] = useState(props.profile || {});

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

export default withApollo(BlogPage, { getDataFromTree });
