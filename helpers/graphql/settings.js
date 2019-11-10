import gql from 'graphql-tag';

export const CHANGE_SETTINGS = gql`
  mutation updatePreferences(
    $defaultVoteWeight: Int
    $defaultCommentsVoteWeight: Int
    $showNSFW: Boolean
    $useTfBlacklist: Boolean
    $trackFollows: Boolean
    $trackMentions: Boolean
    $trackReplies: Boolean
    $trackCuration: Boolean
    $trackUpdates: Boolean
    $useDarkMode: Boolean
    $hasAcceptedCookies: Boolean
    $useHighPrecisionVotingSlider: Boolean
    $useAdvancedEditorOptions: Boolean
    $claimRewards: Boolean
  ) {
    updatePreferences(
      defaultVoteWeight: $defaultVoteWeight
      defaultCommentsVoteWeight: $defaultCommentsVoteWeight
      showNSFW: $showNSFW
      useTfBlacklist: $useTfBlacklist
      trackFollows: $trackFollows
      trackMentions: $trackMentions
      trackReplies: $trackReplies
      trackCuration: $trackCuration
      trackUpdates: $trackUpdates
      useDarkMode: $useDarkMode
      hasAcceptedCookies: $hasAcceptedCookies
      useHighPrecisionVotingSlider: $useHighPrecisionVotingSlider
      useAdvancedEditorOptions: $useAdvancedEditorOptions
      claimRewards: $claimRewards
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
      trackFollows
      trackMentions
      trackReplies
      trackCuration
      trackUpdates
      useHighPrecisionVotingSlider
      useAdvancedEditorOptions
      claimRewards
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
