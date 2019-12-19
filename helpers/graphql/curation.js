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
    $notes: String
    $attentionLevel: Int
    $formatting: Boolean
    $language: Boolean
    $bilingual: Boolean
    $footer: Boolean
    $photos: Boolean
    $short: Boolean
    $writing: Boolean
    $valueadding: Boolean
  ) {
    addCurationAuthorNotes(
      author: $author
      notes: $notes
      attentionLevel: $attentionLevel
      formatting: $formatting
      language: $language
      bilingual: $bilingual
      footer: $footer
      photos: $photos
      short: $short
      writing: $writing
      valueadding: $valueadding
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
      formatting
      language
      bilingual
      footer
      photos
      short
      writing
      valueadding
    }
  }
`;

export const GET_CURATION_SCORES = gql`
  query getCurationScores {
    getCurationScores {
      author
      permlink
      title
      score
    }
  }
`;

export const SET_CURATION_SCORE = gql`
  mutation setCurationScore(
    $author: String!
    $permlink: String!
    $title: String!
    $score: Int!
    $formatting: Boolean
    $language: Boolean
    $bilingual: Boolean
    $footer: Boolean
    $photos: Boolean
    $short: Boolean
    $writing: Boolean
    $valueadding: Boolean
  ) {
    setCurationScore(
      author: $author
      permlink: $permlink
      title: $title
      score: $score
      formatting: $formatting
      language: $language
      bilingual: $bilingual
      footer: $footer
      photos: $photos
      short: $short
      writing: $writing
      valueadding: $valueadding
    ) {
      success
      message
    }
  }
`;
