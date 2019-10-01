import Grow from '@material-ui/core/Grow';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import Typography from '@material-ui/core/Typography';
import RandomIcon from '@material-ui/icons/Explore';
import CountryIcon from '@material-ui/icons/Landscape';
import CityIcon from '@material-ui/icons/LocationCity';
import MapIcon from '@material-ui/icons/Map';
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
import Link from '../../lib/Link';
import DestinationCityColumn from '../Destinations/DestinationCityColumn';
import DestinationCountryColumn from '../Destinations/DestinationCountryColumn';
import DestinationMenuItem from '../Destinations/DestinationMenuItem';

class HeaderPopupNav extends Component {
  state = {
    selection: undefined,
    random: undefined,
  };

  onMenuClick = selection => {
    this.setState({ selection });
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
        <div
          className="w-100 container bg-primary"
          style={{
            paddingLeft: '0px',
            position: 'fixed',
            zIndex: 99999,
            top: '65px',
            right: '0px',
            left: '0px',
          }}
        >
          <Popper open={this.props.showDest} transition disablePortal>
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{
                  transformOrigin:
                    placement === 'bottom' ? 'center top' : 'center bottom',
                }}
              >
                <Paper>
                  <div className="row">
                    <div className="col-xl-4 col-lg-4 col-md-4">
                      <MenuList>
                        <DestinationMenuItem
                          onClick={this.onMenuClick}
                          icon={<CountryIcon />}
                          text="Popular Countries"
                          active={this.state.selection !== 'Popular Places'}
                        />
                        <DestinationMenuItem
                          onClick={this.onMenuClick}
                          icon={<CityIcon />}
                          text="Popular Places"
                          active={this.state.selection === 'Popular Places'}
                        />
                        <Link color="textPrimary" href="/map">
                          <DestinationMenuItem
                            onClick={this.props.closeDest}
                            icon={<MapIcon />}
                            text="Map"
                          />
                        </Link>
                        <Link
                          color="textPrimary"
                          href={`/destinations?country=${this.state.random}`}
                          as={`/destinations/${this.state.random}`}
                        >
                          <DestinationMenuItem
                            onClick={this.newRandom}
                            icon={<RandomIcon />}
                            text="Random Destination"
                          />
                        </Link>
                      </MenuList>
                    </div>
                    <div className="col-xl-8 col-lg-8 col-md-8">
                      {(this.state.selection === 'Popular Places' && (
                        <div className="container-fluid">
                          <div className="row">
                            <div className="col-4">
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
                            <div className="col-4">
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
                            <div className="col-4">
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
                      )) || (
                        <div className="container-fluid">
                          <div className="row">
                            <div className="col-4">
                              <MenuList>
                                <MenuItem>
                                  <Typography variant="h6">Europe</Typography>
                                </MenuItem>
                                <DestinationCountryColumn
                                  onClick={this.props.closeDest}
                                  countryCodes={featuredCcEurope}
                                />
                              </MenuList>
                            </div>
                            <div className="col-4">
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
                            <div className="col-4">
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
                      )}
                    </div>
                  </div>
                </Paper>
              </Grow>
            )}
          </Popper>
        </div>
      </Fragment>
    );
  }
}

HeaderPopupNav.propTypes = {
  closeDest: PropTypes.func.isRequired,
  showDest: PropTypes.bool.isRequired,
};

export default HeaderPopupNav;
