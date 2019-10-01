import Paper from '@material-ui/core/Paper';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import FavoriteIcon from '@material-ui/icons/Favorite';
import HotIcon from '@material-ui/icons/FlightTakeoff';
import FeaturedIcon from '@material-ui/icons/Star';
import Link from 'next/link';
import PropTypes from 'prop-types';
import React from 'react';

class TagsOrderBySelect extends React.Component {
  render() {
    return (
      <Paper square>
        <Tabs
          value={this.props.selection}
          onChange={this.handleChange}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Link
            color="textPrimary"
            as={`/hot/${this.props.tags}`}
            href={`/tag?tags=${this.props.tags}&orderby=sc_hot`}
          >
            <Tab icon={<HotIcon />} label="TAKING OFF" />
          </Link>
          <Link
            color="textPrimary"
            as={`/featured/${this.props.tags}`}
            href={`/tag?tags=${this.props.tags}&orderby=featured`}
          >
            <Tab icon={<FeaturedIcon />} label="FEATURED" />
          </Link>
          <Link
            color="textPrimary"
            as={`/favorites/${this.props.tags}`}
            href={`/tag?tags=${this.props.tags}&orderby=total_votes`}
          >
            <Tab icon={<FavoriteIcon />} label="FAVORITES" />
          </Link>
        </Tabs>
      </Paper>
    );
  }
}

TagsOrderBySelect.propTypes = {
  selection: PropTypes.number.isRequired,
  tags: PropTypes.string.isRequired,
};

export default TagsOrderBySelect;
