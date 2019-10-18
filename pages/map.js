import { useTheme } from '@material-ui/styles';
import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import Head from '../components/Header/Head';
import Header from '../components/Header/Header';
import Map from '../components/Maps/MapCluster';
import { GET_PLACES } from '../helpers/graphql/places';

const MapPage = props => {
  const theme = useTheme();

  const title = 'Map';
  return (
    <Fragment>
      <Header subheader={title} active="map" />
      <Head title={`${title} - TravelFeed: The Travel Community`} />
      {
        // Fetches all posts with a location and a minimum upvote of 50%.
        // Not-curated posts are not displayed since they are usually
        // less relevant.
      }
      <Query query={GET_PLACES}>
        {({ data }) => {
          if (data && data.places) {
            return (
              <Map
                data={data && data.places}
                dark={theme.palette.type === 'dark'}
                latitude={props.latitude}
                longitude={props.longitude}
                zoom={props.zoom}
                getHeightFromContainer
              />
            );
          }
          return <Fragment />;
        }}
      </Query>
    </Fragment>
  );
};

MapPage.getInitialProps = props => {
  const latitude = Number(props.query.latitude);
  const longitude = Number(props.query.longitude);
  const zoom = Number(props.query.zoom);
  return { latitude, longitude, zoom };
};

export default MapPage;
