import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import capitalize from '../../helpers/capitalize';
import { nameFromSlug, slugFromCC } from '../../helpers/countryCodes';
import Link from '../../lib/Link';

class DestinationCountryColumn extends Component {
  render() {
    const { onClick, text, countryCodes } = this.props;
    const slugs = [];
    countryCodes.forEach(cc => slugs.push(slugFromCC(cc)));
    slugs.sort();
    return slugs.map(slug => {
      const name = nameFromSlug(slug);
      return (
        <Link
          color="textPrimary"
          key={slug}
          href={`/destinations?country=${slug}`}
          as={`/destinations/${slug}`}
        >
          <MenuItem onClick={() => onClick && onClick(text)}>
            <ListItemText primary={capitalize(name)} />
          </MenuItem>
        </Link>
      );
    });
  }
}

DestinationCountryColumn.defaultProps = {
  text: undefined,
};

DestinationCountryColumn.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string,
  countryCodes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default DestinationCountryColumn;
