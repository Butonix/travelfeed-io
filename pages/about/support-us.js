/* eslint-disable react/no-unescaped-entities */
import { indigo } from '@material-ui/core/colors';
import Grid from '@material-ui/core/Grid';
import React, { Fragment } from 'react';
import AboutSelect from '../../components/About/AboutSelect';
import SupportUs from '../../components/About/SupportUs';
import HeaderCard from '../../components/General/HeaderCard';
import Head from '../../components/Header/Head';
import Header from '../../components/Header/Header';

const SupportUsPage = () => {
  const title = 'Support Us';
  return (
    <Fragment>
      <Header subheader={title} />
      <Head title={`${title}`} />
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
            content={<SupportUs />}
          />
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default SupportUsPage;
