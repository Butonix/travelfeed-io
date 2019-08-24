import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Error from 'next/error';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import Head from '../Header/Head';

const NotFound = props => {
  let helmet = 'Error | TravelFeed';
  if (props.statusCode === 404) {
    helmet = '404 - Not Found | TravelFeed';
  } else if (props.statusCode === 'logged_out') {
    helmet = 'Logged Out | TravelFeed';
  }
  let content = <Error statusCode={404} />;
  if (props.statusCode === 'logged_out') {
    content = (
      <Fragment>
        <h1>Error: Logged Out</h1>
        <p>
          You need to log in to view this page. Use the sign in button on the
          top right to log in to your account.
        </p>
      </Fragment>
    );
  }
  if (props.statusCode === 'invalid_login') {
    content = (
      <Fragment>
        <h1>Error: Invalid login credentials</h1>
        <p>
          The login credentials you provided are not valid. Please log in again.
        </p>
      </Fragment>
    );
  }
  return (
    <Fragment>
      <Head title={helmet} />
      <Card>
        <CardContent>{content}</CardContent>
      </Card>
    </Fragment>
  );
};

NotFound.propTypes = {
  statusCode: PropTypes.number.isRequired,
};

export default NotFound;
