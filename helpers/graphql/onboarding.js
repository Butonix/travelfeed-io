/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const ONBOARD_START = gql`
  mutation onboardStart(
    $email: String!
    $isNewsletter: Boolean
    $referrer: String
  ) {
    onboardStart(
      email: $email
      isNewsletter: $isNewsletter
      referrer: $referrer
    ) {
      success
      message
    }
  }
`;

export const ONBOARD_INFO = gql`
  mutation onboardInformation(
    $infoToken: String!
    $post: String!
    $accountMetadata: String
  ) {
    onboardInformation(
      infoToken: $infoToken
      post: $post
      accountMetadata: $accountMetadata
    ) {
      success
      message
    }
  }
`;

export const ONBOARD_CREATE = gql`
  mutation onboardCreate(
    $claimToken: String!
    $username: String!
    $postingPubKey: String!
    $activePubKey: String!
    $memoPubKey: String!
    $ownerPubKey: String!
    $password: String
  ) {
    onboardCreate(
      claimToken: $claimToken
      username: $username
      postingPubKey: $postingPubKey
      activePubKey: $activePubKey
      memoPubKey: $memoPubKey
      ownerPubKey: $ownerPubKey
      password: $password
    ) {
      success
      message
    }
  }
`;
