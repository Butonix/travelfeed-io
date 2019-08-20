/* eslint-disable react/no-unescaped-entities */
import { indigo, teal } from '@material-ui/core/colors';
import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import ReactPiwik from 'react-piwik';
import Head from '../../components/Header/Head';
import Header from '../../components/Header/Header';
import { DEFAULT_META_DESCRIPTION } from '../../config';
import { imageProxy } from '../../helpers/getImage';
import { GET_TF_STATS } from '../../helpers/graphql/stats';

class JoinPage extends Component {
  componentDidMount() {
    ReactPiwik.push(['trackGoal', 1]);
  }

  render() {
    return (
      <Fragment>
        <Head
          title="Join TravelFeed: The Travel Community"
          description={DEFAULT_META_DESCRIPTION}
        />
        <Header />
        <Query query={GET_TF_STATS} variables={{ days: 1000 }}>
          {({ data, loading, error }) => {
            if (loading || error || data.stats === null) {
              return <Fragment />;
            }
            return (
              <Fragment>
                {' '}
                <div
                  style={{
                    backgroundImage: `url(/img/header-1.jpg)`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover',
                    width: '100%',
                    height: '500px',
                  }}
                >
                  <div className="container text-center h-100">
                    <div className="row justify-content-center align-items-center h-100">
                      <div className="col-xl-6 col-md-8 col-sm-11 col-xs-12">
                        <h1 className="display-4">Join TravelFeed!</h1>
                        <p className="lead">
                          On TravelFeed, you can discover travel content created
                          by a large community of likeminded travellers! With{' '}
                          <strong>{data.stats.posts} blog posts</strong>, you
                          will almost certainly discover insiders' tips about
                          your travel destination and find other travellers to
                          connect with.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="jumbotron mb-0 text-light"
                  style={{ background: indigo[900] }}
                >
                  <div className="container text-center">
                    <div className="row justify-content-center align-items-center h-100">
                      <div className="col-xl-6 col-md-8 col-sm-11 col-xs-12">
                        <h1 className="display-4">
                          <strong>The</strong> Travel Community.
                        </h1>
                        <p className="lead">
                          With <strong>{data.stats.authors} authors</strong> and
                          many more readers, TravelFeed is one of the largest
                          international communities of independent travellers
                          and the largest travel community on Steem.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    backgroundImage: `url(/img/header-2.jpg)`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover',
                    width: '100%',
                    height: '500px',
                  }}
                >
                  <div className="container text-center h-100">
                    <div className="row justify-content-center align-items-center h-100">
                      <div className="col-xl-6 col-md-8 col-sm-11 col-xs-12">
                        <h1 className="display-4">Start Blogging!</h1>
                        <p className="lead">
                          Ready to start your own travel blog? We offer you a
                          free blog hosted on the uncensorable Steem Blockchain.
                          When readers like your post, they will hit the 'take
                          off' button and assign miles to it.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="jumbotron mb-0 text-center text-light"
                  style={{ background: teal[900] }}
                >
                  <div className="container">
                    <div className="row justify-content-center align-items-center h-100">
                      <div className="col-xl-8 col-md-9 col-sm-11 col-xs-12">
                        <h1 className="display-4">
                          Get Paid for Your Travel Blog
                        </h1>
                        <p className="lead">
                          With TravelFeed, earning an online income becomes
                          reality! Seven days after publishing your post, you
                          can claim the reward for your post in cryptocurrency.
                        </p>
                        <p className="lead">
                          So far, <strong>${data.stats.payout}</strong> have
                          been paid out to TravelFeed authors.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    backgroundImage: `url(/img/header-3.jpg)`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center right',
                    backgroundSize: 'cover',
                    width: '100%',
                    height: '500px',
                  }}
                >
                  <div className="container text-center h-100">
                    <div className="row justify-content-center align-items-center h-100">
                      <div className="col-xl-6 col-md-8 col-sm-11 col-xs-12">
                        {' '}
                        <h1 className="display-4">Join the Community!</h1>
                        <p className="lead">
                          Join the TravelFeed Discord to become part of the
                          TravelFeed community! To use TravelFeed, you need an
                          account for the Steem Blockchain. Just ask us on
                          Discord and we will set you up with a free Steem
                          account! If you already have a Steem account, you can
                          log in by pressing the button on the top right.
                        </p>
                        <a
                          href="https://discord.gg/jWWu73H"
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                        >
                          <button type="button" className="btn btn-dark p-0">
                            <img
                              alt="Discord"
                              src={imageProxy(
                                'https://cdn.steemitimages.com/DQmboc2XspF4neKbj8cN6WTuCrpADoehKxdXBgfiaWjFsFx/Discord-Logo+Wordmark-Color%20(1).png',
                                130,
                              )}
                            />
                          </button>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </Fragment>
            );
          }}
        </Query>
      </Fragment>
    );
  }
}

export default JoinPage;
