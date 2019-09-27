import Grid from '@material-ui/core/Grid';
import React, { Fragment, useEffect, useState } from 'react';
import Bookmarks from '../components/Bookmarks/Bookmarks';
import NotFound from '../components/General/NotFound';
import Head from '../components/Header/Head';
import Header from '../components/Header/Header';
import { getUser } from '../helpers/token';

const BookmarksPage = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  return (
    <Fragment>
      <Header subheader="Bookmarks" />
      <Head title="Bookmarks - TravelFeed: The Travel Community" />
      {(user === null && <></>) ||
        (user && (
          <>
            <div className="container" id="containerInvisibleOnMobile">
              <Bookmarks user={user} />
            </div>
            <style>{`
        @media (max-width: 992px) {
          #containerInvisibleOnMobile {
            padding: 0;
            margin: 0;
          }
        }
        `}</style>
          </>
        )) || (
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
        )}
    </Fragment>
  );
};

export default BookmarksPage;
