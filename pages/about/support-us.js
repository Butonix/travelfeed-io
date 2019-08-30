/* eslint-disable react/no-unescaped-entities */
import Button from '@material-ui/core/Button';
import { indigo } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import React, { Fragment } from 'react';
import AboutSelect from '../../components/About/AboutSelect';
import HeaderCard from '../../components/General/HeaderCard';
import Head from '../../components/Header/Head';
import Header from '../../components/Header/Header';
import Link from '../../lib/Link';

const SupportUsPage = () => {
  const title = 'Support Us';
  return (
    <Fragment>
      <Header subheader={title} />
      <Head title={`${title} - TravelFeed: The Travel Community`} />
      <AboutSelect selection={5} />
      <Grid
        container
        spacing={0}
        alignItems="center"
        justify="center"
        className="pt-4 pb-4"
      >
        <Grid item lg={7} md={8} sm={11} xs={12}>
          <HeaderCard
            title={title}
            background={indigo[600]}
            content={
              <div className="textPrimary postcontent">
                <h4 className="pt-2">Delegate to @travelfeed</h4>
                <p>
                  Delegations help us give higher rewards to content creators.
                  Currently, there are no rewards for delegators, but once our
                  platform is more advanced, and we have published our
                  whitepaper, we will announce a delegation plan that will also
                  consider current and past delegations. Be assured that you
                  won't regret it, if you delegate to @travelfeed today!
                </p>
                <div className="text-center pb-3">
                  <a
                    className="p-1"
                    href="https://app.steemconnect.com/sign/delegate_vesting_shares?delegatee=travelfeed&vesting_shares=100.000%20SP&redirect_uri=https%3A%2F%2Ftravelfeed.io%2Fabout%2Fsupport-us"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                  >
                    <Button variant="contained" color="secondary">
                      100 SP
                    </Button>
                  </a>
                  <a
                    className="p-1"
                    href="https://app.steemconnect.com/sign/delegate_vesting_shares?delegatee=travelfeed&vesting_shares=250.000%20SP&redirect_uri=https%3A%2F%2Ftravelfeed.io%2Fabout%2Fsupport-us"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                  >
                    <Button variant="contained" color="secondary">
                      250 SP
                    </Button>
                  </a>
                  <a
                    className="p-1"
                    href="https://app.steemconnect.com/sign/delegate_vesting_shares?delegatee=travelfeed&vesting_shares=500.000%20SP&redirect_uri=https%3A%2F%2Ftravelfeed.io%2Fabout%2Fsupport-us"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                  >
                    <Button variant="contained" color="secondary">
                      500 SP
                    </Button>
                  </a>
                  <a
                    className="p-1"
                    href="https://app.steemconnect.com/sign/delegate_vesting_shares?delegatee=travelfeed&vesting_shares=1000.000%20SP&redirect_uri=https%3A%2F%2Ftravelfeed.io%2Fabout%2Fsupport-us"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                  >
                    <Button variant="contained" color="secondary">
                      1000 SP
                    </Button>
                  </a>
                  <a
                    className="p-1"
                    href="https://app.steemconnect.com/sign/delegate_vesting_shares?delegatee=travelfeed&vesting_shares=5000.000%20SP&redirect_uri=https%3A%2F%2Ftravelfeed.io%2Fabout%2Fsupport-us"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                  >
                    <Button variant="contained" color="secondary">
                      5000 SP
                    </Button>
                  </a>
                  <a
                    className="p-1"
                    href="https://app.steemconnect.com/sign/delegate_vesting_shares?delegatee=travelfeed&vesting_shares=10000.000%20SP&redirect_uri=https%3A%2F%2Ftravelfeed.io%2Fabout%2Fsupport-us"
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                  >
                    <Button variant="contained" color="secondary">
                      10000 SP
                    </Button>
                  </a>
                </div>
                <Divider />
                <h4 className="pt-4">Follow the TravelFeed Curation Trail</h4>
                <p>
                  By following our curation trail, you automatically upvote all
                  posts that we curate and help to reward quality content
                  creators. We have made{' '}
                  <Link
                    color="textPrimary"
                    as="/@travelfeed/tutorial-follow-the-travelfeed-curation-trail-on-steemauto"
                    href="/post?author=travelfeed&permlink=tutorial-follow-the-travelfeed-curation-trail-on-steemauto"
                    passHref
                  >
                    <a>a simple tutorial</a>
                  </Link>{' '}
                  explaining how to follow our curation trail.
                </p>
                <Divider />
                <h4 className="pt-4">Upvote our Daily Curation Posts</h4>
                <p>
                  Upvoting our curation posts helps us to give higher rewards to
                  the featured bloggers, who receive a share of the post
                  rewards, and to pay our running costs. If you want to
                  automatically upvote our posts, set up Steemauto as described
                  in the tutorial above and add travelfeed to your "fanbase".
                </p>
                <Divider />
                <h4 className="pt-4">Join the Team!</h4>
                <p>
                  We are still looking for more curators to join our curation
                  team! There is no direct financial reward and your TravelFeed
                  posts would be excluded from curation while you are part of
                  the curation team, but if you stick around for the long term,
                  you will receive your part of the team share once we tokenize
                  TravelFeed.
                </p>
                <p>
                  We are also looking for developers to help to improve
                  TravelFeed. Please ping @jpphotography{' '}
                  <a
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                    href="https://discord.gg/jWWu73H"
                  >
                    on our Discord server
                  </a>{' '}
                  if you are interested! TravelFeed is fully open-source, open
                  issues are listed{' '}
                  <a
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                    href="https://github.com/travelfeed-io/travelfeed-io/labels/help%20wanted"
                  >
                    on Github
                  </a>
                  .
                </p>
                <Divider />
                <h4 className="pt-4">Donate</h4>
                <p>
                  We currently pay all server costs out of our own pockets.
                  Donations to the Steem account @travelfeed, whether in Steem,
                  SBD, Steem-Engine tokens or SBI shares, help us a lot.
                </p>
                <Divider />
                <h4 className="pt-4">Report Bugs</h4>
                <p>
                  TravelFeed is still in Beta. If you encounter any bugs, please
                  report them{' '}
                  <a
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                    href="https://discord.gg/jWWu73H"
                  >
                    on our Discord server
                  </a>{' '}
                  in the channel #travelfeed. If you have a Github account, you
                  can also{' '}
                  <a
                    target="_blank"
                    rel="nofollow noreferrer noopener"
                    href="https://github.com/travelfeed-io/travelfeed-io/issues/new"
                  >
                    submit an issue at our Github repository
                  </a>
                  .
                </p>
              </div>
            }
          />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default SupportUsPage;
