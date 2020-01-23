import { Query } from '@apollo/react-components';
import { useTheme } from '@material-ui/styles';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import Head from '../components/Header/Head';
import Header from '../components/Header/Header';
import Map from '../components/Maps/MapCluster';
import { MAPBOX_TOKEN } from '../config';
import { GET_PLACES } from '../helpers/graphql/places';
import withApollo from '../lib/withApollo';

const MapPage = () => {
  const router = useRouter();

  const latitude = Number(router.query.latitude);
  const longitude = Number(router.query.longitude);
  const zoom = Number(router.query.zoom);
  const { search } = router.query;

  const [bbox, setBbox] = useState(undefined);
  const [center, setCenter] = useState(undefined);

  const theme = useTheme();

  useEffect(() => {
    if (search) {
      fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          search,
        )}.json?limit=1&language=en-GB&access_token=${MAPBOX_TOKEN}`,
      )
        .then(res => {
          return res.json();
        })
        .then(data => {
          if (data && data.features && data.features.length > 0) {
            setBbox(data.features[0].bbox);
            setCenter(data.features[0].center);
          }
        });
    }
  }, []);

  const title = 'Map';
  return (
    <Fragment>
      <Header subheader={title} active="map" />
      <Head title="Travel Blog Map" includeMapbox />
      {
        // Fetches all posts with a location and a minimum upvote of 50%.
        // Not-curated posts are not displayed since they are usually
        // less relevant.
      }
      <Query query={GET_PLACES}>
        {({ data }) => {
          if (data && data.places) {
            return (
              <>
                {(search && !center && <></>) || (
                  <Map
                    data={data && data.places}
                    dark={theme.palette.type === 'dark'}
                    latitude={
                      center && center.length > 0 ? center[1] : latitude
                    }
                    longitude={
                      center && center.length > 0 ? center[0] : longitude
                    }
                    zoom={zoom}
                    bbox={bbox}
                    getHeightFromContainer
                  />
                )}
              </>
            );
          }
          return <Fragment />;
        }}
      </Query>
    </Fragment>
  );
};

export default withApollo(MapPage);
