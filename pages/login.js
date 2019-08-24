import Grid from '@material-ui/core/Grid';
import Router from 'next/router';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Mutation, Query } from 'react-apollo';
import NotFound from '../components/General/NotFound';
import Header from '../components/Header/Header';
import LoginDialog from '../components/Login/LoginDialog';
import { ACCEPT_TOS, GET_LOGIN_TOKEN } from '../helpers/graphql/token';
import { setAccessToken, setScToken } from '../helpers/token';

const LoginPage = props => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  });

  const { sc_token, expires_in } = props.sc;
  return (
    <>
      <Header />
      <Grid
        container
        spacing={0}
        alignItems="center"
        justify="center"
        className="pt-4 pb-4"
        style={{ paddingLeft: '75px' }}
      >
        <Grid item lg={7} md={8} sm={11} xs={12}>
          <>
            <Query
              query={GET_LOGIN_TOKEN}
              variables={{
                sc_token,
              }}
            >
              {({ data, loading }) => {
                if (loading || !loaded) {
                  return (
                    <>
                      <Header />
                      <Grid
                        container
                        spacing={0}
                        alignItems="center"
                        justify="center"
                        className="pt-4 pb-4"
                        style={{ paddingLeft: '75px' }}
                      >
                        <Grid item lg={7} md={8} sm={11} xs={12} />
                      </Grid>
                    </>
                  );
                }
                if (data) {
                  // If tos are not accepted, display tos dialogue
                  if (
                    data &&
                    data.login &&
                    data.login.hasAcceptedTos === false
                  ) {
                    return (
                      <Mutation
                        mutation={ACCEPT_TOS}
                        variables={{
                          sc_token,
                          acceptTos: true,
                        }}
                      >
                        {// eslint-disable-next-line no-shadow
                        (acceptTos, data) => {
                          // If successful
                          if (
                            data &&
                            data.data &&
                            data.data.login.hasAcceptedTos
                          ) {
                            if (data.data.login.jwt)
                              setAccessToken(data.data.login.jwt, expires_in);
                            else return <NotFound statusCode="invalid_login" />;
                            if (sc_token) setScToken(sc_token, expires_in);
                            Router.replace('/dashboard');
                            return <></>;
                          }
                          return <LoginDialog acceptTos={acceptTos} />;
                        }}
                      </Mutation>
                    );
                  }
                  if (sc_token) setScToken(sc_token, expires_in);
                  if (data.login.jwt) {
                    setAccessToken(data.login.jwt, expires_in);
                    Router.replace('/dashboard');
                  } else return <NotFound statusCode="invalid_login" />;
                  return '';
                }
                return (
                  <>
                    <NotFound statusCode={404} />
                  </>
                );
              }}
            </Query>
          </>
        </Grid>
      </Grid>
    </>
  );
};

LoginPage.getInitialProps = props => {
  const sc_token = props.query.access_token;
  const { expires_in } = props.query;
  return {
    sc: {
      sc_token,
      expires_in,
    },
  };
};

LoginPage.propTypes = {
  sc: PropTypes.objectOf(PropTypes.string),
};

export default LoginPage;
