import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import { green, red } from '@material-ui/core/colors';
import FormLabel from '@material-ui/core/FormLabel';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import React, { useState } from 'react';
import { Mutation, Query } from 'react-apollo';
import {
  CONTEST_IS_OPTED_IN,
  CONTEST_OPT_IN,
} from '../../../helpers/graphql/contest';
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
                  }}
                >
                  {(
                    contestOptIn,
                    // eslint-disable-next-line no-shadow
                    { data, loading },
                  ) => {
                    if (
                      data &&
                      data.contestOptIn &&
                      data.contestOptIn.success
                    ) {
                      if (querying) setOptedIn(!optedIn);
                      setQuerying(false);
                    }
                    if (loading) {
                      setQuerying(true);
                      return <CircularProgress />;
                    }
                    return (
                      <>
                        <HeaderCard
                          title={
                            (optedIn &&
                              'You are participating in the Steemfest contest') ||
                            'Opt in to participate'
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
                                <Button
                                  color="primary"
                                  variant="contained"
                                  onClick={contestOptIn}
                                >
                                  {(optedIn && 'Opt Out') || 'Opt In'}
                                </Button>{' '}
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
