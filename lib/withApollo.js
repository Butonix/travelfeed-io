/* eslint-disable no-console */
import { ApolloProvider } from '@apollo/react-hooks';
import ApolloClient, { InMemoryCache } from 'apollo-boost';
import Cookie from 'js-cookie';
import withApollo from 'next-with-apollo';
import React from 'react';
import { GRAPHQL_URL } from '../config';

export default withApollo(
  ({ initialState }) => {
    return new ApolloClient({
      uri: GRAPHQL_URL,
      cache: new InMemoryCache().restore(initialState || {}),
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
