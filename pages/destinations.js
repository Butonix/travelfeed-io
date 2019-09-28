// TODO: Create content for /destinations, especially for mobile view
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import DestinationHeader from '../components/Destinations/DestinationHeader';
import DestinationsContent from '../components/Destinations/DestinationsPage';
import PostGrid from '../components/Grid/PostGrid';
import Head from '../components/Header/Head';
import Header from '../components/Header/Header';
import { ccFromSlug, nameFromSlug } from '../helpers/countryCodes';

class DestinationsPage extends Component {
  static async getInitialProps(props) {
    const { country } = props.query;
    const { subdivision } = props.query;
    const { city } = props.query;
    const { suburb } = props.query;
    return {
      country,
      subdivision,
      city,
      suburb,
    };
  }

  render() {
    const { country } = this.props;
    const countryName = nameFromSlug(country);
    const country_code = ccFromSlug(country);
    const { subdivision } = this.props;
    const { city } = this.props;
    const { suburb } = this.props;
    if (!country_code)
      return (
        <Fragment>
          <Head
            title="Destinations - TravelFeed: The Travel Community"
            description="Discover the best travel destinations on TravelFeed."
          />
          <Header subheader="Destinations" active="destinations" />
          <DestinationsContent />
        </Fragment>
      );
    const title = `${(suburb && `${suburb}, ${city}`) ||
      (city && `${city}, ${countryName}`) ||
      (subdivision && `${subdivision}, ${countryName}`) ||
      countryName}`;
    return (
      <Fragment>
        <Head
          title={`${title} - TravelFeed: The Travel Community`}
          description={`Discover the best travel blog posts about ${suburb ||
            city ||
            subdivision ||
            countryName} on TravelFeed.`}
        />
        <Header subheader={title} active="destinations" />
        <DestinationHeader
          countrySlug={country}
          query={{ country_code, subdivision, city }}
          title={title}
        />
        <div className="container" id="containerInvisibleOnMobile">
          <PostGrid
            active="destination"
            query={{
              limit: 9,
              orderby: 'curation_score DESC, total_votes DESC',
              country_code,
              subdivision,
              city,
              suburb,
            }}
            grid={{ lg: 4, md: 4, sm: 6, xs: 12 }}
            cardHeight={170}
            poststyle="grid"
          />
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

DestinationsPage.defaultProps = {
  subdivision: undefined,
  city: undefined,
  suburb: undefined,
  query: undefined,
};

DestinationsPage.propTypes = {
  country: PropTypes.string.isRequired,
  subdivision: PropTypes.string,
  city: PropTypes.string,
  suburb: PropTypes.string,
  // eslint-disable-next-line react/no-unused-prop-types
  query: PropTypes.objectOf(PropTypes.string),
};

export default DestinationsPage;
