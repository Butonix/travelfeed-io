// Todo: Add delete account to remove all of users data from our database
import { teal } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { Fragment, useContext, useState } from 'react';
import { Mutation, Query } from 'react-apollo';
import { CHANGE_SETTINGS, GET_SETTINGS } from '../../helpers/graphql/settings';
import HeaderCard from '../General/HeaderCard';
import UserContext from '../General/UserContext';

const weights = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const Settings = props => {
  const { theme, setDarkMode, setLightMode } = useContext(UserContext);

  const useDarkMode = theme === 'dark';

  const [loaded, setLoaded] = useState(false);

  const [saved, setSaved] = useState(true);

  const [defaultVoteWeight, setDefaultVoteWeight] = useState(0);

  const [defaultCommentsVoteWeight, setDefaultCommentsVoteWeight] = useState(0);

  const [showNSFW, setShowNSFW] = useState(false);

  const [useTfBlacklist, setUseTfBlacklist] = useState(true);

  const handleCheckboxChange = name => event => {
    if (name === 'useDarkMode') {
      if (useDarkMode) setLightMode();
      else setDarkMode();
    } else if (name === 'showNSFW') {
      setShowNSFW(event.target.checked);
    } else if (name === 'useTfBlacklist') {
      setUseTfBlacklist(event.target.checked);
    }
  };

  const newNotification = notification => {
    if (notification !== undefined) {
      let variant = 'success';
      if (notification.success === false) {
        variant = 'error';
      }
      const { enqueueSnackbar } = props;
      enqueueSnackbar(notification.message, { variant });
    }
  };

  return (
    <Fragment>
      <Grid
        container
        spacing={0}
        alignItems="center"
        justify="center"
        className="pt-4 pb-4 p-2"
      >
        <Grid item lg={7} md={8} sm={11} xs={12}>
          <HeaderCard
            title="Settings"
            background={teal[600]}
            content={
              <Query fetchPolicy="network-only" query={GET_SETTINGS}>
                {({ data }) => {
                  if (data) {
                    if (loaded === false && data && data.preferences) {
                      setLoaded(true);
                      setDefaultVoteWeight(data.preferences.defaultVoteWeight);
                      setDefaultCommentsVoteWeight(
                        data.preferences.defaultCommentsVoteWeight,
                      );
                      setShowNSFW(data.preferences.showNSFW);
                      setUseTfBlacklist(data.preferences.useTfBlacklist);
                      return <Fragment />;
                    }
                    return (
                      <Mutation
                        mutation={CHANGE_SETTINGS}
                        variables={{
                          defaultVoteWeight,
                          defaultCommentsVoteWeight,
                          showNSFW,
                          useTfBlacklist,
                        }}
                      >
                        {changeSettings => {
                          if (data.loading && saved) {
                            setSaved(false);
                          }
                          if (data.data && !saved) {
                            newNotification({
                              success: data.data.updatePreferences.success,
                              message: data.data.updatePreferences.message,
                            });
                            setSaved(true);
                          }
                          return (
                            <Fragment>
                              <FormControl fullWidth>
                                <FormGroup>
                                  <FormControlLabel
                                    labelPlacement="end"
                                    control={
                                      <Switch
                                        checked={showNSFW}
                                        onChange={handleCheckboxChange(
                                          'showNSFW',
                                        )}
                                        onInput={changeSettings}
                                        value="showNSFW"
                                        color="primary"
                                      />
                                    }
                                    label="Show NSFW posts"
                                  />
                                  <Divider />
                                  <FormControlLabel
                                    labelPlacement="end"
                                    control={
                                      <Switch
                                        checked={useTfBlacklist}
                                        onChange={handleCheckboxChange(
                                          'useTfBlacklist',
                                        )}
                                        onInput={changeSettings}
                                        value="useTfBlacklist"
                                        color="primary"
                                      />
                                    }
                                    label="Use TravelFeed Blacklist"
                                  />
                                  <Divider />
                                  <FormControlLabel
                                    labelPlacement="end"
                                    control={
                                      <Switch
                                        checked={useDarkMode}
                                        onChange={handleCheckboxChange(
                                          'useDarkMode',
                                        )}
                                        onInput={changeSettings}
                                        value="useDarkMode"
                                        color="primary"
                                      />
                                    }
                                    label="Use dark mode"
                                  />
                                  <Divider />
                                  <TextField
                                    select
                                    label="Default miles weight for posts"
                                    value={defaultVoteWeight}
                                    onChange={value => {
                                      setDefaultVoteWeight(value.target.value);
                                      changeSettings({
                                        variables: {
                                          defaultVoteWeight: value.target.value,
                                        },
                                      });
                                    }}
                                    margin="normal"
                                  >
                                    {weights.map(w => (
                                      <MenuItem key={w} value={w}>
                                        {w}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                  <Divider />
                                  <TextField
                                    select
                                    label="Default miles weight on comments"
                                    value={defaultCommentsVoteWeight}
                                    onChange={value => {
                                      setDefaultCommentsVoteWeight(
                                        value.target.value,
                                      );
                                      changeSettings({
                                        variables: {
                                          defaultCommentsVoteWeight:
                                            value.target.value,
                                        },
                                      });
                                    }}
                                    margin="normal"
                                  >
                                    {weights.map(w => (
                                      <MenuItem key={w} value={w}>
                                        {w}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </FormGroup>
                              </FormControl>
                            </Fragment>
                          );
                        }}
                      </Mutation>
                    );
                  }
                  return <Fragment />;
                }}
              </Query>
            }
          />
        </Grid>
      </Grid>
    </Fragment>
  );
};

Settings.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
};
export default withSnackbar(Settings);
