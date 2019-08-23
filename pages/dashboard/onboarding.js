import Grid from '@material-ui/core/Grid';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import Onboarding from '../../components/Dashboard/Onboarding';
import NotFound from '../../components/General/NotFound';
import Head from '../../components/Header/Head';
import Header from '../../components/Header/Header';
import { getRoles, getUser } from '../../helpers/token';

class OnboardingPage extends Component {
  static async getInitialProps(props) {
    const { open } = props.query;
    return { open };
  }

  render() {
    const DashboardHeader = dynamic(
      () => import('../../components/Dashboard/DashboardMenu'),
      {
        ssr: false,
      },
    );
    const { open } = this.props;
    if (
      getUser() === null ||
      !getUser() ||
      getRoles().indexOf('curator') === -1
    ) {
      return (
        <Fragment>
          <Header />
          <Grid
            container
            spacing={0}
            alignItems="center"
            justify="center"
            className="pt-4 pb-4"
            style={{ paddingLeft: '75px' }}
          >
            <Grid item lg={7} md={8} sm={11} xs={12}>
              <NotFound statusCode="logged_out" />
            </Grid>
          </Grid>
        </Fragment>
      );
    }
    return (
      <Fragment>
        <Head title="TravelBlog: Onboarding - TravelFeed: The Travel Community" />
        <DashboardHeader
          active="onboarding"
          content={<Onboarding />}
          open={open}
        />
      </Fragment>
    );
  }
}

OnboardingPage.defaultProps = {
  query: undefined,
  open: undefined,
};

OnboardingPage.propTypes = {
  open: PropTypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
  query: PropTypes.arrayOf(PropTypes.string),
};
export default OnboardingPage;
