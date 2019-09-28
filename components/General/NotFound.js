import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React from 'react';
import Link from '../../lib/Link';
import Head from '../Header/Head';
import FixedBackgroundImage from './FixedBackgroundImage';

const NotFound = props => {
  const { statusCode } = props;

  let error = {
    title: `Error: ${statusCode}`,
    message: 'An error occured.',
  };
  if (statusCode === 'logged_out')
    error = {
      title: 'Error: Logged Out',
      message:
        'You need to log in to view this page. Use the "Login" button on the top right to log in to your account.',
    };
  else if (statusCode === 404)
    error = {
      title: '404: Not Found',
      message: 'This page could not be found.',
    };
  else if (statusCode === 'invalid_login')
    error = {
      title: 'Invalid login credentials',
      message:
        'The login credentials you provided are not valid. Please log in again.',
    };
  return (
    <>
      <FixedBackgroundImage
        backgroundImage="https://img.travelfeed.io/jpphotography%2F20190928T190403125Z-easysignup-2.jpg"
        component={
          <>
            <Head title={`${error.title} | TravelFeed`} />

            <Grid
              container
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
              style={{ minHeight: '100vh', marginTop: '-65px' }}
            >
              <Grid item lg={7} md={8} sm={11} xs={11}>
                <Card>
                  <CardContent>
                    <div className="text-center">
                      <Typography variant="h4" gutterBottom>
                        {error.title}
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {error.message}
                      </Typography>
                      <div className="pt-2">
                        <Link href="/" passHref>
                          <a>
                            <Button color="primary" variant="contained">
                              Back to Homepage
                            </Button>
                          </a>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </>
        }
      />
    </>
  );
};

NotFound.propTypes = {
  statusCode: PropTypes.number.isRequired,
};

export default NotFound;
