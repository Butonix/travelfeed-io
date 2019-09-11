import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green, red } from '@material-ui/core/colors';
import FormLabel from '@material-ui/core/FormLabel';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Router from 'next/router';
import React, { useState } from 'react';
import { Mutation, Query } from 'react-apollo';
import { customJson } from '../../../helpers/actions';
import {
  CONTEST_IS_OPTED_IN,
  CONTEST_OPT_IN,
} from '../../../helpers/graphql/contest';
import { getRoles } from '../../../helpers/token';
import HeaderCard from '../../General/HeaderCard';

const redTheme = createMuiTheme({
  palette: {
    primary: red,
  },
});

const greenTheme = createMuiTheme({
  palette: {
    primary: green,
  },
});

const OptIn = () => {
  const [optedIn, setOptedIn] = useState(undefined);
  const [querying, setQuerying] = useState(false);
  const [transactionId, setTransactionId] = useState(undefined);
  const [mutating, setMutating] = useState(false);

  const broadcastJson = () => {
    setQuerying(true);
    const roles = getRoles();
    if (roles && roles.indexOf('easylogin') === -1) {
      const payload = {
        contest: 'sf4',
      };
      const id = optedIn ? 'tf_contest_opt_out' : 'tf_contest_opt_in';
      customJson(payload, id).then(result => {
        if (result && result.transactionId)
          setTransactionId(result.transactionId);
        else setQuerying(false);
      });
    } else {
      // If easylogin is used, the custom json is broadcasted by the API
      setTransactionId('easylogin');
    }
  };

  return (
    <>
      <Query fetchPolicy="network-only" query={CONTEST_IS_OPTED_IN}>
        {({ data }) => {
          if (data && data.contestIsOptedIn !== undefined) {
            if (!optedIn) setOptedIn(data.contestIsOptedIn);
            return (
              <>
                <Mutation
                  mutation={CONTEST_OPT_IN}
                  variables={{
                    optedIn: !optedIn,
                    transactionId,
                  }}
                >
                  {(
                    contestOptIn,
                    // eslint-disable-next-line no-shadow
                    { data, loading },
                  ) => {
                    if (transactionId && !mutating && querying) {
                      setMutating(true);
                      contestOptIn();
                    }
                    if (data && data.contestOptIn) {
                      if (querying && data.contestOptIn.success)
                        setOptedIn(!optedIn);
                      // Hard reset to remove cached data - otherwise opting in/out again is buggy
                      Router.push(`/dashboard/contest`);
                      setQuerying(false);
                    }
                    if (loading) {
                      return <CircularProgress />;
                    }
                    return (
                      <>
                        <HeaderCard
                          title={
                            (optedIn &&
                              'You are Participating in the Steemfest Contest') ||
                            'Opt in to Participate'
                          }
                          background={(optedIn && green[600]) || red[600]}
                          content={
                            <>
                              <FormLabel component="legend" className="pt-4">
                                {(optedIn &&
                                  'By participating, you agree that the ticket can only be used by yourself and not be sold. If you cannot attend Steemfest, you can opt out of the contest by clicking the button below.') ||
                                  'Click the button to opt in to participate in the Steemfest contest. By participating, you agree that the ticket can only be used by yourself and not be sold.'}
                              </FormLabel>
                              <MuiThemeProvider
                                theme={(optedIn && redTheme) || greenTheme}
                              >
                                {(!querying && (
                                  <Button
                                    color="primary"
                                    variant="contained"
                                    onClick={broadcastJson}
                                  >
                                    {(optedIn && 'Opt Out') || 'Opt In'}
                                  </Button>
                                )) || <CircularProgress />}
                              </MuiThemeProvider>
                            </>
                          }
                        />
                      </>
                    );
                  }}
                </Mutation>
              </>
            );
          }
          return <CircularProgress />;
        }}
      </Query>
    </>
  );
};

export default OptIn;
