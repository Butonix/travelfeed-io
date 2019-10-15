import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import PhotoDetailHeader from '../components/General/PhotoDetailHeader';
import PostGrid from '../components/Grid/PostGrid';
import Head from '../components/Header/Head';
import Header from '../components/Header/Header';
import { slugFromCC } from '../helpers/countryCodes';

class LocationPage extends Component {
  static async getInitialProps(props) {
    const { formatted_address, country_code, showlocations } = props.query;
    const locations = props.query.location_box.split(',');
    const location_box = [];
    locations.forEach(el => {
      location_box.push(parseFloat(el));
    });

    return {
      location_box,
      formatted_address,
      country_code,
      showlocations,
    };
  }

  render() {
    const showLocations =
      this.props.showlocations === 'true' ? this.props.country_code : undefined;
    return (
      <Fragment>
        <Head
          title={`${this.props.formatted_address} - TravelFeed: The Travel Community`}
          description={`Explore posts about ${this.props.formatted_address} on TravelFeed.`}
        />
        <Header active="location" />
        <PhotoDetailHeader
          query={{
            search: this.props.formatted_address,
            country_code: showLocations,
          }}
          title={this.props.formatted_address}
          countrySlug={slugFromCC(this.props.country_code)}
        />
        <div className="pb-2">
          <div className="container" id="containerInvisibleOnMobile">
            <PostGrid
              active="destination"
              query={{
                location_box: this.props.location_box,
                country_code: this.props.country_code,
                orderby: 'curation_score DESC, total_votes DESC',
                limit: 9,
              }}
              grid={{ lg: 4, md: 4, sm: 6, xs: 12 }}
              cardHeight={200}
              poststyle="grid"
            />
          </div>
        </div>
        <style>{`
        @media (max-width: 992px) {
          #containerInvisibleOnMobile {
            padding: 0;
            margin: 0;
          }
        }
        `}</style>
      </Fragment>
    );
  }
}

LocationPage.defaultProps = {
  query: undefined,
};

LocationPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  query: PropTypes.objectOf(PropTypes.string),
  showlocations: PropTypes.string.isRequired,
  formatted_address: PropTypes.string.isRequired,
  location_box: PropTypes.arrayOf(PropTypes.number).isRequired,
  country_code: PropTypes.string.isRequired,
};

export default LocationPage;
