import Typography from '@material-ui/core/Typography';
import React, { Fragment } from 'react';
import Head from '../../components/Header/Head';
import Header from '../../components/Header/Header';
import PopupNavItems from '../../components/Header/PopupNavItems';
import withApollo from '../../lib/withApollo';

const DestinationsPage = () => {
  return (
    <Fragment>
      <Head
        title="Destinations"
        description="Discover the best travel destinations on TravelFeed."
      />
      <Header subheader="Destinations" active="destinations" />
      <Typography variant="h4" className="text-center p-3">
        Popular Countries
      </Typography>
      <PopupNavItems countries />
      <Typography variant="h4" className="text-center p-3">
        Popular Places
      </Typography>
      <PopupNavItems places />
    </Fragment>
  );
};

export default withApollo(DestinationsPage);
