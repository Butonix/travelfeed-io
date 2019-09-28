import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Router from 'next/router';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import NotFound from '../components/General/NotFound';
import Head from '../components/Header/Head';
import Header from '../components/Header/Header';

class ExitPage extends Component {
  static async getInitialProps({ req }) {
    const { url } = req.query;
    return { url };
  }

  render() {
    const { url } = this.props;
    return (
      <Fragment>
        <Head title="External Link | TravelFeed" />
        <Header />
        <Grid
          container
          spacing={0}
          alignItems="center"
          justify="center"
          className="pt-4 pb-4"
        >
          {(url === 'undefined' && <NotFound statusCode={404} />) || (
            <Grid item lg={7} md={8} sm={11} xs={12}>
              <Card className="text-center">
                <CardContent>
                  <h1>Warning: External Link</h1>
                  <p>
                    Warning: This is an external link. Please check it carefully
                    before proceeding.
                  </p>
                  <p>{url}</p>
                  <Button
                    onClick={() => Router.back()}
                    color="primary"
                    variant="outlined"
                    className="m-1"
                  >
                    Go back
                  </Button>
                  <a
                    rel="nofollow noopener noreferrer"
                    target="_blank"
                    href={url}
                  >
                    <Button color="primary" variant="contained" className="m-1">
                      Visit this Website
                    </Button>
                  </a>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Fragment>
    );
  }
}

ExitPage.defaultProps = {
  url: undefined,
};

ExitPage.propTypes = {
  url: PropTypes.string,
};

export default ExitPage;
