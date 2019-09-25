import Grid from '@material-ui/core/Grid';
import dynamic from 'next/dynamic';
import React, { Fragment, useEffect, useState } from 'react';
import { getUser } from '../../helpers/token';
import NotFound from '../General/NotFound';
import Head from '../Header/Head';
import Header from '../Header/Header';

const DashboardPage = props => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const DashboardHeader = dynamic(() => import('./DashboardMenu'), {
    ssr: false,
  });
  const { open } = props;

  if (user) {
    if (user === null || !user) {
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
      <>
        <Head
          title={`TravelBlog: ${props.label.charAt(0).toUpperCase() +
            props.label.slice(1)} - TravelFeed: The Travel Community`}
        />
        <DashboardHeader
          active={props.label}
          content={props.content}
          open={open}
        />
      </>
    );
  }
  return (
    <>
      <Head
        title={`TravelBlog: ${props.label.charAt(0).toUpperCase() +
          props.label.slice(1)} - TravelFeed: The Travel Community`}
      />
    </>
  );
};

export default DashboardPage;
