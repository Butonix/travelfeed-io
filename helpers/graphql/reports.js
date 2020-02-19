import gql from 'graphql-tag';

export const GET_REPORTED_POSTS = gql`
  query reportedPosts {
    reportedPosts {
      author
      permlink
      reason
      details
      reporter
    }
  }
`;

export const SET_AS_REPORT_REVIEWED = gql`
  mutation setAsReportReviewed($author: String!, $permlink: String!) {
    setAsReportReviewed(author: $author, permlink: $permlink) {
      success
      message
    }
  }
`;
