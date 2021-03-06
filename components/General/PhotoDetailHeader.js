import { Query } from '@apollo/react-components';
import React, { Fragment, useEffect, useState } from 'react';
import { isWebpSupported } from 'react-image-webp/dist/utils';
import { nameFromSlug } from '../../helpers/countryCodes';
import { imageProxy } from '../../helpers/getImage';
import { GET_LOCATION_DETAILS } from '../../helpers/graphql/locations';
import Head from '../Header/Head';
import PhotoHeader from './PhotoHeader';

const PhotoDetailHeader = props => {
  const { query, countrySlug, title, tag } = props;

  const [screenWidth, setScreenWidth] = useState(1920);
  const [webpSupport, setWebpSupport] = useState(undefined);

  useEffect(() => {
    setScreenWidth(Math.ceil(window.innerWidth / 100) * 100);
    setWebpSupport(isWebpSupported());
  }, []);

  const countryName = nameFromSlug(countrySlug);

  return (
    <Fragment>
      <Query query={GET_LOCATION_DETAILS} variables={query}>
        {({ data, loading }) => {
          if (loading || (data && data.locationDetails)) {
            const detailTitle =
              (data && data.locationDetails && data.locationDetails.title) ||
              title;
            let description = `${
              tag ? `Discover ${detailTitle}` : `Visit ${detailTitle}`
            }: ${
              data &&
              data.locationDetails.budget_score &&
              data.locationDetails.budget_score < 3
                ? `Traveling ${detailTitle} is affordable and exciting! `
                : ''
            }`;
            if (
              data &&
              !data.locationDetails.url &&
              data.locationDetails.description
            )
              description += `${data.locationDetails.description} `;
            description += `Explore the best places to visit, discover insider's tips, find out what to do${
              data &&
              data.locationDetails.budget_score &&
              data.locationDetails.budget_score > 4
                ? ` in ${detailTitle} on a budget`
                : ''
            } and read the top travel blogs about ${detailTitle} on TravelFeed!`;

            let image = '';
            if (data && data.locationDetails.unsplashUser) {
              image = webpSupport
                ? data.locationDetails.image.replace(/&fm=jpg/, '&fm=webp')
                : data.locationDetails.image;
            } else if (data && data.locationDetails.image) {
              image = imageProxy(
                data.locationDetails.image,
                screenWidth,
                500,
                undefined,
                webpSupport ? 'webp' : undefined,
              );
            }

            const { country_code, subdivision, city } = props.query;
            const breadcrumbs = [];
            if (country_code) {
              breadcrumbs.push(
                {
                  position: 1,
                  name: 'Destinations',
                  item: `https://travelfeed.io/destinations`,
                },
                {
                  position: 2,
                  name: countryName,
                  item: `https://travelfeed.io/destinations/${props.countrySlug}`,
                },
              );
            }
            if (subdivision) {
              breadcrumbs.push({
                position: 3,
                name: subdivision,
                item: `https://travelfeed.io/destinations/${props.countrySlug}/${subdivision}`,
              });
            }
            if (city) {
              breadcrumbs.push({
                position: 4,
                name: city,
                item: `https://travelfeed.io/destinations/${props.countrySlug}/${subdivision}/${city}`,
              });
            }

            return (
              <>
                <Head
                  noIndex={props.noIndex}
                  shorttitle={`${title}: Top Travel Blogs`}
                  description={description}
                  breadcrumbs={breadcrumbs}
                />
                <PhotoHeader
                  title={detailTitle}
                  description={
                    data ? data.locationDetails.description : description
                  }
                  image={image}
                  query={query}
                  countrySlug={countrySlug}
                  tag={tag}
                  subtitle={
                    (data && data.locationDetails.subtitle) || countryName
                  }
                  countryName={countryName}
                  locationDetails={
                    data && data.locationDetails ? data.locationDetails : {}
                  }
                />
              </>
            );
          }
          return <Fragment />;
        }}
      </Query>
    </Fragment>
  );
};

export default PhotoDetailHeader;
