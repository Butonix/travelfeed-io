import { indigo, teal } from '@material-ui/core/colors';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withSnackbar } from 'notistack';
import React, { Fragment } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getUser } from '../../helpers/token';
import Link from '../../lib/Link';
import HeaderCard from '../General/HeaderCard';
import OptIn from './Contest/OptIn';
import RaffleTickets from './Contest/RaffleTickets';
import ReferAFriend from './Contest/ReferAFriend';

const Contest = props => {
  const newNotification = notification => {
    if (notification !== undefined) {
      let variant = 'success';
      if (notification.success === false) {
        variant = 'error';
      }
      props.enqueueSnackbar(notification.message, { variant });
    }
  };

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
                <Typography className="pt-4">
                  <p>
                    By using TravelFeed, you can earn raffle tickets. These
                    raffle tickets give you a chance to participate in the final
                    drawing to win a ticket + accomodation to Steemfest
                    sponsored by{' '}
                    <Link
                      as="/@blocktrades"
                      href="/blog?author=blocktrades"
                      passHref
                    >
                      <a>@blocktrades</a>
                    </Link>
                    .{' '}
                    <Typography display="inline" color="primary">
                      <a
                        href="https://steemfest.com/"
                        rel="noopener noreferrer nofollow"
                        target="_blank"
                      >
                        Steemfest
                      </a>
                    </Typography>{' '}
                    is held from November 6th to November 10th 2019 in Bangkok.
                  </p>
                  <ul>
                    <li>
                      10 tickets for an article which is one of the 5 articles
                      per day which receive a full upvote from us and will be
                      featured on our front page<sup>*</sup>
                    </li>
                    <li>
                      3 tickets for an article we chose as honorable mention
                      (50% upvote)<sup>*</sup>
                    </li>
                    <li>
                      {' '}
                      50/40/30 tickets for the 1st/2nd/3rd weekly winner,
                      announced every Friday
                      <sup>*</sup>
                    </li>
                    <li>
                      Up to 3 tickets per day for sharing TravelFeed posts on
                      social media using the share buttons below posts
                    </li>
                    <li>
                      Referral program: 20 tickets for each new user
                      (non-Steemian) or 10 tickets for each new Steemian signed
                      up via your referral link. On top of that, you earn 10% of
                      the tickets earned for posting by each user you refer.
                    </li>
                    <li>
                      20 tickets for good posts promoting TravelFeed and the
                      giveaway - on and off Steem. Send us the link{' '}
                      <Typography display="inline" color="primary">
                        <a
                          href="https://steemfest.com/"
                          rel="noopener noreferrer nofollow"
                          target="_blank"
                        >
                          on our Discord
                        </a>
                      </Typography>{' '}
                      to claim your tickets!
                    </li>
                  </ul>
                  <p>
                    <sup>*</sup> Only posts authored through TravelFeed.io are
                    eligible, not posts using only the tag.
                  </p>
                </Typography>
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
                <div>
                  <CopyToClipboard
                    text={`https://travelfeed.io/join?ref=${getUser()}`}
                    onCopy={() =>
                      newNotification({
                        success: true,
                        message: 'Copied your referral link to your clipboard',
                      })
                    }
                  >
                    <TextField
                      variant="filled"
                      fullWidth
                      margin="dense"
                      multiline
                      value={`https://travelfeed.io/join?ref=${getUser()}`}
                    />
                  </CopyToClipboard>
                </div>
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

export default withSnackbar(Contest);
