import gql from 'graphql-tag';

export const GET_USER_STATS = gql`
  query userstats {
    userstats {
      total_posts
      total_featured
      recent_payouts {
        month
        earnings
      }
      quality_score {
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
  }
`;

export const GET_TF_STATS = gql`
  query stats($days: Int!) {
    stats(days: $days) {
      payout
      authors
      posts
    }
  }
`;
