import GoogleMapReact from 'google-map-react';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { GMAPS_API_KEY } from '../../config';
import MapMarker from './Marker';

class PostMap extends Component {
  state = {
    center: this.props.location.coordinates,
    zoom: 7,
  };

  render() {
    if (this.state.center.lat === null || this.state.center.lng === null) {
      return <Fragment />;
    }
    return (
      // Important! Always set the container height explicitly
      <Fragment>
        <div
          style={{ height: '250px', width: '100%', padding: '0 24px 0 24px' }}
        >
          <GoogleMapReact
            bootstrapURLKeys={{
              key: GMAPS_API_KEY,
            }}
            defaultCenter={this.state.center}
            defaultZoom={this.state.zoom}
          >
            <MapMarker
              lat={this.state.center.lat}
              lng={this.state.center.lng}
            />
          </GoogleMapReact>
        </div>
      </Fragment>
    );
  }
}

PostMap.propTypes = {
  location: PropTypes.objectOf(PropTypes.objectOf(PropTypes.number)).isRequired,
};

export default PostMap;
