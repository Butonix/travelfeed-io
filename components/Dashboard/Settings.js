// Todo: Add delete account to remove all of users data from our database
import { teal } from '@material-ui/core/colors';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { Fragment, useContext, useEffect, useState } from 'react';
import { Mutation, Query } from 'react-apollo';
import { requestPostingAuthority } from '../../helpers/actions';
import { CHANGE_SETTINGS, GET_SETTINGS } from '../../helpers/graphql/settings';
import hasPostingAuthority from '../../helpers/hasPostingAuthority';
import { registerServiceWorker } from '../../helpers/notifications';
import { getRoles, getUser } from '../../helpers/token';
import HeaderCard from '../General/HeaderCard';
import UserContext from '../General/UserContext';
import LinkEasyLogin from './Settings/LinkEasyLogin';

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
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [
    useHighPrecisionVotingSlider,
    setUseHighPrecisionVotingSlider,
  ] = useState(false);
  const [useAdvancedEditorOptions, setUseAdvancedEditorOptions] = useState(
    false,
  );
  const [claimRewards, setClaimRewards] = useState(false);
  const [roles, setRoles] = useState(undefined);

  useEffect(() => {
    setRoles(getRoles());

    // https://developers.google.com/web/updates/2015/03/push-notifications-on-the-open-web

    // Are Notifications supported in the service worker?
    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
      return;
    }

    // Check the current Notification permission.
    // If its denied, it's a permanent block until the
    // user changes the permission
    if (Notification.permission === 'denied') {
      return;
    }

    // Check if push messaging is supported
    if (!('PushManager' in window)) {
      return;
    }
    setNotificationPermission(Notification.permission === 'granted');
  }, []);

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

  const handleCheckboxChange = name => event => {
    if (name === 'useDarkMode') {
      if (useDarkMode) setLightMode();
      else setDarkMode();
    } else if (name === 'showNSFW') {
      setShowNSFW(event.target.checked);
    } else if (name === 'useTfBlacklist') {
      setUseTfBlacklist(event.target.checked);
    } else if (name === 'useHighPrecisionVotingSlider') {
      setUseHighPrecisionVotingSlider(event.target.checked);
    } else if (name === 'useAdvancedEditorOptions') {
      setUseAdvancedEditorOptions(event.target.checked);
    } else if (name === 'claimRewards') {
      const { checked } = event.target;
      if (event.target.checked)
        hasPostingAuthority(getUser()).then(res => {
          if (res) setClaimRewards(checked);
          else if (window && !window.steem_keychain) {
            newNotification({
              message:
                'You need to give posting authority to @travelfeed.app to enable automated rewards claiming.',
              success: false,
            });
          } else {
            newNotification({
              message:
                'You need to give posting authority to @travelfeed.app to enable automated rewards claiming.',
              success: false,
            });
            requestPostingAuthority().then(postAuthRes => {
              if (postAuthRes.success) setClaimRewards(checked);
              else newNotification(res);
            });
          }
        });
      else setClaimRewards(checked);
    } else if (name === 'notificationPermission') {
      if (!notificationPermission)
        Notification.requestPermission(status => {
          setNotificationPermission(status === 'granted');
          registerServiceWorker();
        });
      newNotification({
        message: 'You can disable notifications in your browser settings',
      });
      setNotificationPermission(false);
    }
  };

  return (
    <Fragment>
      <Grid
        container
        spacing={0}
        alignItems="center"
        justify="center"
        className="p-2"
      >
        <Grid item lg={7} md={8} sm={11} xs={12}>
          <HeaderCard
            title="Settings"
            background={teal[600]}
            content={
              <Query fetchPolicy="network-only" query={GET_SETTINGS}>
                {({ data }) => {
                  if (loaded === false && data && data.preferences) {
                    setLoaded(true);
                    setDefaultVoteWeight(data.preferences.defaultVoteWeight);
                    setDefaultCommentsVoteWeight(
                      data.preferences.defaultCommentsVoteWeight,
                    );
                    setShowNSFW(data.preferences.showNSFW);
                    setUseTfBlacklist(data.preferences.useTfBlacklist);
                    setUseHighPrecisionVotingSlider(
                      data.preferences.useHighPrecisionVotingSlider,
                    );
                    setUseAdvancedEditorOptions(
                      data.preferences.useAdvancedEditorOptions !== false,
                    );
                    setClaimRewards(data.preferences.claimRewards);
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
                        useHighPrecisionVotingSlider,
                        useAdvancedEditorOptions,
                        claimRewards,
                      }}
                    >
                      {(changeSettings, data) => {
                        if (data && data.loading && saved) {
                          setSaved(false);
                        }
                        if (data && data.error) {
                          newNotification({
                            success: false,
                            message: 'Network Error. Are you online?',
                          });
                        }
                        if (data && data.data && !saved) {
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
                                  label="Use TravelFeed blacklist"
                                />

                                <FormControlLabel
                                  labelPlacement="end"
                                  control={
                                    <Switch
                                      checked={useHighPrecisionVotingSlider}
                                      onChange={handleCheckboxChange(
                                        'useHighPrecisionVotingSlider',
                                      )}
                                      onInput={changeSettings}
                                      value="useHighPrecisionVotingSlider"
                                      color="primary"
                                    />
                                  }
                                  label="High precision voting slider"
                                />

                                <FormControlLabel
                                  labelPlacement="end"
                                  control={
                                    <Switch
                                      checked={useAdvancedEditorOptions}
                                      onChange={handleCheckboxChange(
                                        'useAdvancedEditorOptions',
                                      )}
                                      onInput={changeSettings}
                                      value="useAdvancedEditorOptions"
                                      color="primary"
                                    />
                                  }
                                  label="Advanced editor options"
                                />
                                <FormControlLabel
                                  labelPlacement="end"
                                  control={
                                    <Switch
                                      checked={claimRewards}
                                      onChange={handleCheckboxChange(
                                        'claimRewards',
                                      )}
                                      onInput={changeSettings}
                                      value="claimRewards"
                                      color="primary"
                                    />
                                  }
                                  label="Automatically claim rewards"
                                />
                                <FormControlLabel
                                  labelPlacement="end"
                                  control={
                                    <Switch
                                      checked={useDarkMode}
                                      onChange={handleCheckboxChange(
                                        'useDarkMode',
                                      )}
                                      // onInput={changeSettings}
                                      // For now, dark mode is saved on the device only
                                      value="useDarkMode"
                                      color="primary"
                                    />
                                  }
                                  label="Use dark mode"
                                />
                                <FormControlLabel
                                  labelPlacement="end"
                                  control={
                                    <Switch
                                      checked={notificationPermission}
                                      onChange={handleCheckboxChange(
                                        'notificationPermission',
                                      )}
                                      value="notificationPermission"
                                      color="primary"
                                    />
                                  }
                                  label="Display notifications"
                                />

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
                }}
              </Query>
            }
          />
          {roles && roles.indexOf('easylogin') === -1 && <LinkEasyLogin />}
        </Grid>
      </Grid>
    </Fragment>
  );
};

Settings.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
};
export default withSnackbar(Settings);
