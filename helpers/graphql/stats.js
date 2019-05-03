import gql from "graphql-tag";

export const GET_USER_STATS = gql`
  query userstats {
    userstats {
      total_posts
      total_payout
      total_featured
      recent_payouts {
        month
        earnings
      }
    }
  }
`;
