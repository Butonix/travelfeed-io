import gql from 'graphql-tag';

export const CHANGE_SETTINGS = gql`
  mutation updatePreferences(
    $defaultVoteWeight: Int
    $defaultCommentsVoteWeight: Int
    $showNSFW: Boolean
    $useTfBlacklist: Boolean
    $useDarkMode: Boolean
    $hasAcceptedCookies: Boolean
  ) {
    updatePreferences(
      defaultVoteWeight: $defaultVoteWeight
      defaultCommentsVoteWeight: $defaultCommentsVoteWeight
      showNSFW: $showNSFW
      useTfBlacklist: $useTfBlacklist
      useDarkMode: $useDarkMode
      hasAcceptedCookies: $hasAcceptedCookies
    ) {
      success
      message
    }
  }
`;

export const GET_COOKIES_ACCEPTED = gql`
  query preferences {
    preferences {
      hasAcceptedCookies
    }
  }
`;

export const GET_SETTINGS = gql`
  query preferences {
    preferences {
      defaultVoteWeight
      defaultCommentsVoteWeight
      showNSFW
      useDarkMode
      useTfBlacklist
    }
  }
`;

export const GET_VOTE_WEIGHTS = gql`
  query preferences {
    preferences {
      defaultVoteWeight
      defaultCommentsVoteWeight
    }
  }
`;
