/* eslint-disable no-console */
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { setContext } from 'apollo-link-context';
import { createHttpLink } from 'apollo-link-http';
import { createPersistedQueryLink } from 'apollo-link-persisted-queries';
import Cookie from 'js-cookie';
import withApollo from 'next-with-apollo';
import React from 'react';
import { GRAPHQL_URL } from '../config';

const httpLink = createPersistedQueryLink({
  useGETForHashedQueries: true,
}).concat(
  createHttpLink({
    uri: GRAPHQL_URL,
  }),
);

const authLink = setContext((_, { headers }) => {
  // get the authentication token from cookie if it exists
  const token = Cookie.get('access_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token,
    },
  };
});

export default withApollo(
  ({ initialState }) => {
    return new ApolloClient({
      cache: new InMemoryCache().restore(initialState || {}),
      link: authLink.concat(httpLink),
      onError: ({ networkError, graphQLErrors }) => {
        console.log('graphQLErrors', graphQLErrors);
        console.log('networkError', networkError);
      },
    });
  },
  {
    render: ({ Page, props }) => {
      return (
        <ApolloProvider client={props.apollo}>
          <Page {...props} />
        </ApolloProvider>
      );
    },
  },
);
