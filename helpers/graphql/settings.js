import gql from 'graphql-tag';

export const CHANGE_SETTINGS = gql`
  mutation updatePreferences(
    $defaultVoteWeight: Int
    $defaultCommentsVoteWeight: Int
    $showNSFW: Boolean
    $useTfBlacklist: Boolean
    $useDarkMode: Boolean
    $hasAcceptedCookies: Boolean
    $useHighPrecisionVotingSlider: Boolean
    $useAdvancedEditorOptions: Boolean
  ) {
    updatePreferences(
      defaultVoteWeight: $defaultVoteWeight
      defaultCommentsVoteWeight: $defaultCommentsVoteWeight
      showNSFW: $showNSFW
      useTfBlacklist: $useTfBlacklist
      useDarkMode: $useDarkMode
      hasAcceptedCookies: $hasAcceptedCookies
      useHighPrecisionVotingSlider: $useHighPrecisionVotingSlider
      useAdvancedEditorOptions: $useAdvancedEditorOptions
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

export const USE_ADVANCED_EDITOR_OPTIONS = gql`
  query preferences {
    preferences {
      useAdvancedEditorOptions
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
      useHighPrecisionVotingSlider
      useAdvancedEditorOptions
    }
  }
`;

export const GET_VOTE_WEIGHTS = gql`
  query preferences {
    preferences {
      defaultVoteWeight
      defaultCommentsVoteWeight
      useHighPrecisionVotingSlider
    }
  }
`;
