import gql from 'graphql-tag';

export const REPORT_POST = gql`
  mutation reportPost(
    $author: String!
    $permlink: String!
    $reason: String!
    $details: String
  ) {
    reportPost(
      author: $author
      permlink: $permlink
      reason: $reason
      details: $details
    ) {
      success
      message
    }
  }
`;

export const ADD_CURATION_AUTHOR_NOTES = gql`
  mutation addCurationAuthorNotes(
    $author: String!
    $notes: String!
    $attentionLevel: Int!
  ) {
    addCurationAuthorNotes(
      author: $author
      notes: $notes
      attentionLevel: $attentionLevel
    ) {
      success
      message
    }
  }
`;

export const GET_CURATION_AUTHOR_NOTES = gql`
  query getCurationAuthorNotes($authors: [String]!) {
    getCurationAuthorNotes(authors: $authors) {
      author
      notes
      attentionLevel
    }
  }
`;
