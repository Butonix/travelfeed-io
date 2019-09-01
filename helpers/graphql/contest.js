/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const CONTEST_GET = gql`
  query contestGet {
    contestGet {
      user
      type
      tickets
    }
  }
`;

export const CONTEST_SOCIAL = gql`
  mutation contestSocial {
    contestSocial {
      success
      message
    }
  }
`;
