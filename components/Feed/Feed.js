// https://codepen.io/ncerminara/pen/eKNROb
import { Query } from '@apollo/react-components';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import StickyBox from 'react-sticky-box';
import capitalize from '../../helpers/capitalize';
import { IS_NEWSLETTER_SUBSCRIBED } from '../../helpers/graphql/newsletter';
import { getUser } from '../../helpers/token';
import HomeOrderBySelect from '../Grid/HomeOrderBySelect';
import PostGrid from '../Grid/PostGrid';
import Head from '../Header/Head';
import Header from '../Header/Header';
import BlogGridList from '../Sidebar/BlogGridList';
import DiscoverCountry from '../Sidebar/DiscoverCountry';
import LegalNotice from '../Sidebar/LegalNotice';
import NavSide from '../Sidebar/NavSide';
import NewsLetterSubscribe from '../Sidebar/NewsLetterSubscribe';
import SocialLinks from '../Sidebar/SocialLinks';
import LoggedOutFeed from './LoggedOutFeed';

const Feed = props => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser() || false);
  }, []);

  const {
    active,
    selection,
    orderby,
    min_curation_score,
    feed,
    isFeed,
  } = props;

  const NewUsers = dynamic(() => import('../Sidebar/NewUsers'), {
    ssr: false,
  });

  const grid = { lg: 12, md: 12, sm: 12, xs: 12 };

  return (
    <>
      <Head
        title={
          isFeed
            ? 'Feed'
            : `${
                active === 'taking Off' ? 'Hot' : capitalize(active)
              } Travel Blogs`
        }
      />
      <Header active={active} subheader={capitalize(active)} />
      <div className="d-none d-xl-block d-lg-block d-md-block d-sm-block">
        <HomeOrderBySelect selection={selection} />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-xl-3 d-xl-block d-none">
            <StickyBox offsetTop={65} offsetBottom={10}>
              <div className="d-none d-xl-block">
                <NavSide />
                {(user && (
                  <Query
                    query={IS_NEWSLETTER_SUBSCRIBED}
                    variables={{ limit: 9 }}
                    fetchPolicy="network-only"
                  >
                    {({ data }) => {
                      if (data && data.isNewsletterSubscribed === false)
                        return <NewsLetterSubscribe />;
                      return <></>;
                    }}
                  </Query>
                )) ||
                  (user === false && <NewsLetterSubscribe />)}
              </div>
            </StickyBox>
          </div>
          <div className="col-xl-6 col-lg-8 col-md-8 col-sm-12 p-0">
            {// disable SSR for feed -> needs client-side cookie
            (!isFeed || (isFeed && feed)) && (
              <PostGrid
                active={active}
                query={{
                  orderby,
                  min_curation_score,
                  limit: 8,
                  feed,
                  exclude_authors: ['travelfeed', 'steemitworldmap'],
                }}
                grid={grid}
                cardHeight={330}
                poststyle="grid"
              />
            )}
            {isFeed && feed === false && <LoggedOutFeed grid={grid} />}
          </div>
          <div className="col-xl-3 col-lg-4 col-md-4 d-none d-xl-block d-lg-block d-md-block">
            <StickyBox offsetTop={65} offsetBottom={10}>
              <div className="pt-2" />
              <DiscoverCountry />
              <div className="pt-2" />
              <BlogGridList />
              <div className="pt-2" />
              {user && (
                <>
                  <NewUsers />
                  <div className="pt-2" />
                </>
              )}
              <SocialLinks />
              <LegalNotice />
            </StickyBox>
          </div>
        </div>
      </div>
    </>
  );
};

export default Feed;
