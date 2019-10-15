/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const GET_LOCATION_DETAILS = gql`
  query locationDetails(
    $country_code: String
    $subdivision: String
    $city: String
    $search: String
    $tag: String
  ) {
    locationDetails(
      country_code: $country_code
      subdivision: $subdivision
      city: $city
      search: $search
      tag: $tag
    ) {
      description
      image
      attribution
      unsplashUser
      subtitle
      url
      license
      sublocations {
        subdivision
        city
      }
    }
  }
`;
