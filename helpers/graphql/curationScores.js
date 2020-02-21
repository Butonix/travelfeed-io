import gql from 'graphql-tag';

export const GET_POST_CURATION_SCORE = gql`
  query postCurationScores($author: String!, $permlink: String!) {
    postCurationScores(author: $author, permlink: $permlink) {
      formatting
      language
      bilingual
      footer
      photos
      short
      writing
      valueadding
      location
      swm
    }
  }
`;
