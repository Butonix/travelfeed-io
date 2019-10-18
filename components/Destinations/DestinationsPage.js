import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { popularCountries, slugFromCC } from '../../helpers/countryCodes';
import PopupNavItems from '../Header/PopupNavItems';

class DestinationsMobile extends Component {
  state = {
    random: undefined,
  };

  newRandom = () => {
    this.setState({ random: undefined });
    this.props.closeDest();
  };

  render() {
    if (this.state.random === undefined) {
      const randomCountry =
        popularCountries[Math.floor(Math.random() * popularCountries.length)];
      this.setState({ random: slugFromCC(randomCountry) });
    }
    return (
      <Fragment>
        <div className="d-none d-xl-block d-lg-block d-md-block pt-4" />
        <Grid container spacing={0} alignItems="center" justify="center">
          <Grid item lg={7} md={8} sm={11} xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h4" className="text-center p-3">
                  Popular Countries
                </Typography>
                <PopupNavItems countries />
                <Typography variant="h4" className="text-center p-3">
                  Popular Places
                </Typography>
                <PopupNavItems places />
                <Typography variant="h4" className="text-center p-3">
                  Popular Topics
                </Typography>
                <PopupNavItems tags />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <div className="d-none d-xl-block d-lg-block d-md-block pt-4" />
      </Fragment>
    );
  }
}

DestinationsMobile.propTypes = {
  closeDest: PropTypes.func.isRequired,
};

export default DestinationsMobile;
