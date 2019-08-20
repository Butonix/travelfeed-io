import { teal } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import HeaderCard from '../../components/General/HeaderCard';
import Head from '../../components/Header/Head';
import Header from '../../components/Header/Header';
import OnboardStart from '../../components/Onboarding/OnboardStart';

const RegisterStartPage = props => {
  const { ref } = props;
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
          <HeaderCard
            title="Register"
            background={teal[600]}
            content={<OnboardStart referrer={ref} />}
          />
        </Grid>
      </Grid>
    </>
  );
};

RegisterStartPage.getInitialProps = props => {
  const { ref } = props.query;
  return { ref };
};

RegisterStartPage.propTypes = {
  ref: PropTypes.string,
};

export default RegisterStartPage;
