import Grid from '@material-ui/core/Grid';
import React, { useEffect, useState } from 'react';
import { getUser } from '../../helpers/token';
import NotFound from '../General/NotFound';
import Head from '../Header/Head';
import DashboardMenu from './DashboardMenu';

const DashboardPage = props => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  const { open } = props;

  if (user !== null) {
    return (
      <>
        <Head
          title={`TravelBlog: ${props.label.charAt(0).toUpperCase() +
            props.label.slice(1)} - TravelFeed: The Travel Community`}
        />
        <DashboardMenu
          active={props.label}
          content={
            (!user && (
              <Grid
                container
                spacing={0}
                alignItems="center"
                justify="center"
                className="pt-4 pb-4"
              >
                <Grid item lg={7} md={8} sm={11} xs={12}>
                  <NotFound statusCode="logged_out" />
                </Grid>
              </Grid>
            )) ||
            props.content
          }
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
      <DashboardMenu active={props.label} content={<></>} open={open} />
    </>
  );
};

export default DashboardPage;
