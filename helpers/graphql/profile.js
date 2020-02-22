import gql from 'graphql-tag';

export const GET_SHORT_PROFILE = gql`
  query profile($author: String!) {
    profile(username: $author) {
      isCurator
      isBlacklisted
    }
  }
`;

export const GET_IS_FOLLOWED = gql`
  query isFollowed($author: String, $community: String) {
    isFollowed(author: $author, community: $community)
  }
`;
