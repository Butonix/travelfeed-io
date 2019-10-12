/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const GET_POST = gql`
  query post($author: String!, $permlink: String!) {
    post(author: $author, permlink: $permlink) {
      post_id
      author
      display_name
      permlink
      category
      total_votes
      title
      img_url
      created_at
      is_travelfeed
      is_declined
      is_hidden
      is_grayed
      is_nsfw
      is_blacklisted
      curation_score
      latitude
      longitude
      country_code
      subdivision
      city
      suburb
      body
      app
      votes
      tags
      depth
      children
      parent_author
      parent_permlink
      root_author
      root_permlink
      root_title
    }
  }
`;
