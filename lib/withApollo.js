/* eslint-disable no-console */
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { createPersistedQueryLink } from 'apollo-link-persisted-queries';
import Cookie from 'js-cookie';
import withApollo from 'next-with-apollo';
import React from 'react';
import { GRAPHQL_URL } from '../config';

const link = createPersistedQueryLink({ useGETForHashedQueries: true }).concat(
  createHttpLink({ uri: GRAPHQL_URL }),
);

export default withApollo(
  ({ initialState }) => {
    return new ApolloClient({
      uri: GRAPHQL_URL,
      cache: new InMemoryCache().restore(initialState || {}),
      link,
      onError: ({ networkError, graphQLErrors }) => {
        console.log('graphQLErrors', graphQLErrors);
        console.log('networkError', networkError);
      },
      fetchOptions: {
        credentials: 'include',
      },
      request: operation => {
        const token = Cookie.get('access_token');
        operation.setContext({
          headers: {
            authorization: token,
          },
        });
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
