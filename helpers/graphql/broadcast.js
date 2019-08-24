/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const VOTE = gql`
  mutation vote($author: String!, $permlink: String!, $weight: Int!) {
    vote(author: $author, permlink: $permlink, weight: $weight) {
      success
      message
    }
  }
`;

export const POST = gql`
  mutation post(
    $title: String!
    $body: String!
    $parentPermlink: String!
    $parentAuthor: String!
    $jsonMetadata: String!
    $permlink: String!
    $commentOptions: String
  ) {
    post(
      title: $title
      body: $body
      parentPermlink: $parentPermlink
      parentAuthor: $parentAuthor
      jsonMetadata: $jsonMetadata
      permlink: $permlink
      commentOptions: $commentOptions
    ) {
      success
      message
    }
  }
`;

export const CUSTOM_JSON = gql`
  mutation customJson($payload: String!) {
    customJson(payload: $payload) {
      success
      message
    }
  }
`;