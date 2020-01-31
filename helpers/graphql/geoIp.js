import gql from 'graphql-tag';

export const GET_GEOIP = gql`
  query geoIp {
    geoIp {
      hasAcceptedCookies
      countryCode
      isEu
    }
  }
`;
