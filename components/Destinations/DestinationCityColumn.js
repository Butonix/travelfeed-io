import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Link from '../../lib/Link';

class DestinationCityColumn extends Component {
  render() {
    const { cities, onClick, text } = this.props;
    // http://www.javascriptkit.com/javatutors/arraysort2.shtml
    // Sort alphabetically by city name
    cities.sort((a, b) => {
      const nameA = a.city.toLowerCase();
      const nameB = b.city.toLowerCase();
      if (nameA < nameB)
        // sort string ascending
        return -1;
      if (nameA > nameB) return 1;
      return 0; // default return value (no sorting)
    });
    return cities.map(c => {
      return (
        <Link
          color="textPrimary"
          key={c.city}
          href={`/destinations?country=${c.countrySlug}${
            c.nosubdivision ? '' : `&subdivision=${c.subdivision}`
          }${c.nocity ? '' : `&city=${c.city}`}`}
          as={`/destinations/${c.countrySlug}${
            c.nosubdivision ? '' : `/${c.subdivision}`
          }${c.nocity ? '' : `/${c.city}`}`}
        >
          <MenuItem onClick={() => onClick && onClick(text)}>
            <ListItemText primary={c.city} />
          </MenuItem>
        </Link>
      );
    });
  }
}
DestinationCityColumn.defaultProps = {
  text: undefined,
};

DestinationCityColumn.propTypes = {
  cities: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string,
};
export default DestinationCityColumn;
