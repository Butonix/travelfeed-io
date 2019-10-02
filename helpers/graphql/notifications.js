/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const ADD_PUSH_SUBSCRIPTION = gql`
  mutation addPushSubscription($pushSubscription: String!) {
    addPushSubscription(pushSubscription: $pushSubscription) {
      success
      message
    }
  }
`;
