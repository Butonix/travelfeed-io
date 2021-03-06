import Button from '@material-ui/core/Button';
import MapIcon from '@material-ui/icons/Map';
import Skeleton from '@material-ui/lab/Skeleton';
import { useTheme } from '@material-ui/styles';
import React, { Fragment } from 'react';
import LazyLoad from 'react-lazyload';
import ProgressiveImage from 'react-progressive-image';
import { MAPBOX_TOKEN } from '../../config';
import Link from '../../lib/Link';

const PostMap = props => {
  const theme = useTheme();
  const dark = theme.palette.type === 'dark';

  const { latitude, longitude, cardWidth } = props;

  const map_image = `https://api.mapbox.com/styles/v1/mapbox/${
    dark ? 'dark' : 'light'
  }-v9/static/geojson(%7B%22type%22%3A%22Point%22%2C%22coordinates%22%3A%5B${longitude}%2C${latitude}%5D%7D)/${longitude},${latitude},6/${cardWidth}x250?access_token=${MAPBOX_TOKEN}`;

  const placeholder = (
    <div style={{ padding: '0 24px 0 24px' }}>
      <Skeleton variant="rect" width="100%" height={250} />
    </div>
  );

  return (
    // Important! Always set the container height explicitly
    <LazyLoad offset={700} height={250} once placeholder={placeholder}>
      <ProgressiveImage src={map_image} placeholder={placeholder}>
        {(src, loading) => {
          if (loading) {
            return placeholder;
          }
          return (
            <>
              {cardWidth && (
                <Fragment>
                  <div style={{ padding: '0 24px 0 24px' }}>
                    <div
                      style={{
                        height: '250px',
                        width: '100%',
                        backgroundImage: `
          url("${map_image}")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center center',
                        backgroundSize: 'cover',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{ position: 'absolute', bottom: 20 }}
                        className="w-100"
                      >
                        <div className="text-center">
                          <Link
                            href={`/map?zoom=6&latitude=${encodeURIComponent(
                              latitude,
                            )}&longitude=${encodeURIComponent(longitude)}`}
                          >
                            <Button variant="contained" color="primary">
                              <span className="pr-1">Explore the map</span>
                              <MapIcon />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </Fragment>
              )}
            </>
          );
        }}
      </ProgressiveImage>
    </LazyLoad>
  );
};

export default PostMap;
