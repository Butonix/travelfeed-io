import { teal } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import HeaderCard from '../../components/General/HeaderCard';
import NotFound from '../../components/General/NotFound';
import Head from '../../components/Header/Head';
import Header from '../../components/Header/Header';
import OnboardCreate from '../../components/Onboarding/OnboardCreate';

const RegisterCreatePage = props => {
  const { claimToken } = props;
  // TODO: Query if token is valid in the beginning

  return (
    <>
      <Header subheader="Register" />
      <Head title="Register - TravelFeed: The Travel Community" />
      <Grid
        container
        spacing={0}
        alignItems="center"
        justify="center"
        className="pt-4 pb-4"
      >
        <Grid item lg={7} md={8} sm={11} xs={12}>
          {(claimToken && (
            <HeaderCard
              title="Register"
              background={teal[600]}
              content={<OnboardCreate claimToken={claimToken} />}
            />
          )) || <NotFound statusCode={404} />}
        </Grid>
      </Grid>
    </>
  );
};

RegisterCreatePage.getInitialProps = props => {
  const { claimToken } = props.query;
  return { claimToken };
};

RegisterCreatePage.propTypes = {
  claimToken: PropTypes.string,
};

export default RegisterCreatePage;
