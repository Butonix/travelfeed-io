import { teal } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import React, { Fragment } from 'react';
import AboutSelect from '../../components/About/AboutSelect';
import TermsText from '../../components/About/Texts/Terms';
import HeaderCard from '../../components/General/HeaderCard';
import Head from '../../components/Header/Head';
import Header from '../../components/Header/Header';

const TermsPage = () => {
  const title = 'Terms of Service';
  return (
    <Fragment>
      <Header subheader={title} />
      <Head title={`${title} - TravelFeed: The Travel Community`} />
      <AboutSelect selection={1} />
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
            background={teal[600]}
            content={<TermsText />}
          />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default TermsPage;
