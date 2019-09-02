import { indigo, teal } from '@material-ui/core/colors';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import React, { Fragment } from 'react';
import { getUser } from '../../helpers/token';
import HeaderCard from '../General/HeaderCard';
import OptIn from './Contest/OptIn';
import RaffleTickets from './Contest/RaffleTickets';
import ReferAFriend from './Contest/ReferAFriend';

const Onboarding = () => {
  return (
    <Fragment>
      <Grid
        container
        spacing={0}
        alignItems="center"
        justify="center"
        className="pt-4 pb-4 p-2"
      >
        <Grid item className="p-1" lg={12} md={12} sm={12} xs={12}>
          <HeaderCard
            title="How to Participate"
            background={teal[600]}
            content={
              <>
                <FormLabel component="legend" className="pt-4">
                  By participating in TravelFeed, you earn raffle tickets. These
                  raffle tickets give you a chance to participate in the final
                  drawing to win a ticket + accomodation to Steemfest.{' '}
                  <a
                    href="https://steemfest.com/"
                    rel="noopener noreferrer nofollow"
                    target="_blank"
                  >
                    Steemfest
                  </a>{' '}
                  is held from November 6th to November 10th in Bangkok.
                  <ul>
                    <li>
                      10 tickets for an article which is one of the 5 articles
                      per day which receive a full upvote from us and will be
                      featured on our front page
                    </li>
                    <li>
                      3 tickets for an article we chose as honorable mention
                      (50% upvote)
                    </li>
                    <li> 50/40/30 tickets for the 1st/2nd/3rd weekly winner</li>
                    <li>
                      10 tickets for good posts promoting the TravelFeed dApp
                      and the giveaway - on and off Steem. Send us the link to
                      claim your tickets!
                    </li>
                    <li>
                      Up to 3 tickets per day for sharing TravelFeed posts on
                      social media using the share buttons below posts
                    </li>
                    <li>
                      Referral program: 20 tickets for each new user
                      (non-Steemian) or 10 tickets for each new Steemian signed
                      up via an unique referral link. On top of that, the
                      referring users earns 10% of the tickets earned by each
                      user referred by him.
                    </li>
                  </ul>
                </FormLabel>
              </>
            }
          />
        </Grid>
        <Grid item className="p-1" lg={6} md={6} sm={12} xs={12}>
          <OptIn />
        </Grid>
        <Grid item className="p-1" lg={6} md={6} sm={12} xs={12}>
          <HeaderCard
            title="Refer a Friend"
            background={indigo[600]}
            content={
              <>
                <FormLabel component="legend" className="pt-4">
                  Refer your friends to TravelFeed and earn raffle tickets! Fill
                  out the form to send an email to your friends to invite them:
                </FormLabel>
                <ReferAFriend />
                <FormLabel component="legend" className="pt-4">
                  Or use your referral link:
                </FormLabel>
                <TextField
                  fullWidth
                  multiline
                  value={`https://travelfeed.io/join?ref=${getUser()}`}
                  disabled
                />
              </>
            }
          />
        </Grid>
        <Grid item className="p-1" lg={12} md={12} sm={12} xs={12}>
          <RaffleTickets />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Onboarding;
