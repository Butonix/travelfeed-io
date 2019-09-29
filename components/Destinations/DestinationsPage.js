import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import {
  featuredCcAsia,
  featuredCcEurope,
  featuredCcWorld,
  featuredPlacesAsia,
  featuredPlacesEurope,
  featuredPlacesWorld,
  popularCountries,
  slugFromCC,
} from '../../helpers/countryCodes';
import DestinationCityColumn from './DestinationCityColumn';
import DestinationCountryColumn from './DestinationCountryColumn';

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
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xl-4 col-lg-4 col-md-4 col-6">
                      <MenuList className="text-center">
                        <MenuItem>
                          <Typography variant="h6">Europe</Typography>
                        </MenuItem>
                        <DestinationCountryColumn
                          onClick={this.props.closeDest}
                          countryCodes={featuredCcEurope}
                        />
                      </MenuList>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-4 col-6">
                      <MenuList>
                        <MenuItem>
                          <Typography variant="h6">Asia</Typography>
                        </MenuItem>
                        <DestinationCountryColumn
                          onClick={this.props.closeDest}
                          countryCodes={featuredCcAsia}
                        />
                      </MenuList>
                    </div>{' '}
                    <div className="col-xl-4 col-lg-4 col-md-4 col-6">
                      <MenuList>
                        <MenuItem>
                          <Typography variant="h6">World</Typography>
                        </MenuItem>
                        <DestinationCountryColumn
                          onClick={this.props.closeDest}
                          countryCodes={featuredCcWorld}
                        />
                      </MenuList>
                    </div>
                  </div>
                </div>
                <Typography variant="h4" className="text-center p-3">
                  Popular Places
                </Typography>
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-xl-4 col-lg-4 col-md-4 col-6">
                      <MenuList>
                        <MenuItem>
                          <Typography variant="h6">Europe</Typography>
                        </MenuItem>
                        <DestinationCityColumn
                          onClick={this.props.closeDest}
                          cities={featuredPlacesEurope}
                        />
                      </MenuList>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-4 col-6">
                      <MenuList>
                        <MenuItem>
                          <Typography variant="h6">Asia</Typography>
                        </MenuItem>
                        <DestinationCityColumn
                          onClick={this.props.closeDest}
                          cities={featuredPlacesAsia}
                        />
                      </MenuList>
                    </div>
                    <div className="col-xl-4 col-lg-4 col-md-4 col-6">
                      <MenuList>
                        <MenuItem>
                          <Typography variant="h6">World</Typography>
                        </MenuItem>
                        <DestinationCityColumn
                          onClick={this.props.closeDest}
                          cities={featuredPlacesWorld}
                        />
                      </MenuList>
                    </div>
                  </div>
                </div>
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
