import gql from 'graphql-tag';

export const ACCEPT_TOS = gql`
  mutation login(
    $sc_token: String
    $usernameOrEmail: String
    $password: String
    $acceptTos: Boolean
  ) {
    login(
      sc_token: $sc_token
      usernameOrEmail: $usernameOrEmail
      password: $password
      acceptTos: $acceptTos
    ) {
      name
      jwt
      hasAcceptedTos
      success
    }
  }
`;

export const GET_LOGIN_TOKEN = gql`
  query login($sc_token: String, $usernameOrEmail: String, $password: String) {
    login(
      sc_token: $sc_token
      usernameOrEmail: $usernameOrEmail
      password: $password
    ) {
      name
      jwt
      hasAcceptedTos
      success
    }
  }
`;

export const REVOKE_TOKEN = gql`
  mutation revokeToken($token: String!, $expires: String) {
    revokeToken(token: $token, expires: $expires) {
      success
      message
    }
  }
`;
