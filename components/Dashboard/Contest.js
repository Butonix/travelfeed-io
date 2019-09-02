import { green, indigo, teal } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import { CONTEST_GET } from '../../helpers/graphql/contest';
import HeaderCard from '../General/HeaderCard';

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
        <Grid item className="p-1" lg={6} md={6} sm={12} xs={12}>
          <HeaderCard
            title="Opt In"
            background={green[600]}
            content={
              <>
                Opt in to participate in the Steemfest contest. By participating
                you agree that the ticket can only be used by yourself and not
                be sold.
              </>
            }
          />
        </Grid>
        <Grid item className="p-1" lg={6} md={6} sm={12} xs={12}>
          <HeaderCard
            title="Refer a friend"
            background={indigo[600]}
            content={
              <>
                Refer your friends to TravelFeed and earn raffle
                tickets!(Referral form to send email, and message, referral
                linkl to copy)
              </>
            }
          />
        </Grid>
        <Grid item className="p-1" lg={12} md={12} sm={12} xs={12}>
          <HeaderCard
            title="Your raffle tickets"
            background={teal[600]}
            content={
              <Query query={CONTEST_GET}>
                {({ data }) => {
                  if (data && data.contestGet) {
                    console.log(data);
                    return <>There is data</>;
                  }
                  return 'Loading...';
                }}
              </Query>
            }
          />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default Onboarding;
