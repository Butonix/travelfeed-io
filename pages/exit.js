import Grid from '@material-ui/core/Grid';
import { useRouter } from 'next/router';
import React, { Fragment } from 'react';
import ErrorPage from '../components/General/ErrorPage';
import Head from '../components/Header/Head';
import Header from '../components/Header/Header';
import withApollo from '../lib/withApollo';

const ExitPage = () => {
  const router = useRouter();

  const { url } = router.query;

  return (
    <Fragment>
      <Head title="External Link | TravelFeed" noIndex />
      <Header active="page" />
      <Grid
        container
        spacing={0}
        alignItems="center"
        justify="center"
        className="pt-4 pb-4"
      >
        {(url === 'undefined' && <ErrorPage statusCode={404} />) || (
          <ErrorPage statusCode="exit_url" url={url} />
        )}
      </Grid>
    </Fragment>
  );
};

export default withApollo(ExitPage);
