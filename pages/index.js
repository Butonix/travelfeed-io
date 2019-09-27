// https://codepen.io/ncerminara/pen/eKNROb
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import StickyBox from 'react-sticky-box';
import HomeOrderBySelect from '../components/Grid/HomeOrderBySelect';
import PostGrid from '../components/Grid/PostGrid';
import Head from '../components/Header/Head';
import Header from '../components/Header/Header';
import BlogGridList from '../components/Sidebar/BlogGridList';
import JoinNow from '../components/Sidebar/JoinNow';
import LegalNotice from '../components/Sidebar/LegalNotice';
import NavSide from '../components/Sidebar/NavSide';
import SocialLinks from '../components/Sidebar/SocialLinks';
import { getUser } from '../helpers/token';

class HomePage extends Component {
  state = {
    user: undefined,
  };

  static async getInitialProps(props) {
    let { orderby } = props.query;
    let min_curation_score = 0;
    let selection = 0;
    let title = 'TravelFeed';
    let isFeed = false;
    if (orderby === 'created_at') {
      selection = 0;
      min_curation_score = 0;
      title = 'Created';
      isFeed = false;
    } else if (orderby === 'sc_hot') {
      selection = 1;
      min_curation_score = 0;
      title = 'Taking Off';
      isFeed = false;
    } else if (orderby === 'random') {
      selection = 2;
      min_curation_score = 9000;
      title = 'Discover';
      isFeed = false;
    } else if (orderby === 'feed') {
      selection = 4;
      orderby = 'created_at';
      min_curation_score = 0;
      title = 'Feed';
      isFeed = true;
    } else {
      // featured
      orderby = 'created_at';
      selection = 3;
      min_curation_score = 9000;
      title = 'Featured';
      isFeed = false;
    }
    return {
      orderby,
      min_curation_score,
      selection,
      title,
      isFeed,
    };
  }

  componentDidMount() {
    this.setState({
      user: getUser(),
    });
  }

  render() {
    const {
      title,
      selection,
      orderby,
      min_curation_score,
      isFeed,
    } = this.props;
    const { user } = this.state;
    const DiscoverCountry = dynamic(
      () => import('../components/Sidebar/DiscoverCountry'),
      {
        ssr: false,
      },
    );
    return (
      <Fragment>
        <Head
          title={`${title} - TravelFeed: The Travel Community`}
          description="Discover the best travel content on TravelFeed, the world-wide travel community!"
        />
        <Header />
        <HomeOrderBySelect selection={selection} showFeed={user} />
        <div className="container">
          <div className="row">
            <div className="col-xl-3 d-xl-block d-none">
              <StickyBox offsetTop={65} offsetBottom={10}>
                <div className="d-none d-xl-block">
                  {user && <NavSide user={user} />}
                  {!user && <JoinNow />}
                </div>
              </StickyBox>
            </div>
            <div className="col-xl-6 col-lg-8 col-md-8 col-sm-12 p-0">
              <PostGrid
                query={{
                  orderby,
                  min_curation_score,
                  limit: 8,
                  feed: isFeed ? user : undefined,
                  exclude_authors: ['travelfeed', 'steemitworldmap'],
                }}
                grid={{ lg: 12, md: 12, sm: 12, xs: 12 }}
                cardHeight={350}
                poststyle="grid"
              />
            </div>
            <div className="col-xl-3 col-lg-4 col-md-4 d-none d-xl-block d-lg-block d-md-block">
              <StickyBox offsetTop={65} offsetBottom={10}>
                <div className="pt-2" />
                <BlogGridList />
                <div className="pt-2" />
                <DiscoverCountry />
                <div className="pt-2" />
                <SocialLinks />
                <LegalNotice />
              </StickyBox>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

HomePage.defaultProps = {
  query: undefined,
};

HomePage.propTypes = {
  title: PropTypes.string.isRequired,
  orderby: PropTypes.string.isRequired,
  min_curation_score: PropTypes.number.isRequired,
  selection: PropTypes.number.isRequired,
  isFeed: PropTypes.bool.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  query: PropTypes.objectOf(PropTypes.string),
};

export default HomePage;
