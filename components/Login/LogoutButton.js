import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import LogoutIcon from '@material-ui/icons/ExitToApp';
import Router from 'next/router';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import { REVOKE_TOKEN } from '../../helpers/graphql/token';
import { getAccessToken } from '../../helpers/token';

class LogoutButton extends Component {
  state = {
    mounted: false,
    open: false,
  };

  componentDidMount() {
    this.setState({ mounted: true });
  }

  newNotification(notification) {
    if (notification !== undefined) {
      let variant = 'success';
      if (notification.success === false) {
        variant = 'error';
      }
      const { enqueueSnackbar } = this.props;
      enqueueSnackbar(notification.message, { variant });
    }
  }

  render() {
    //   No ssr - need to read cookies
    if (!this.state.mounted) {
      return '';
    }
    const token_details = getAccessToken();
    return (
      <Mutation mutation={REVOKE_TOKEN} variables={token_details}>
        {(revokeToken, data) => {
          if (data && data.data && data.data.revokeToken && !this.state.open) {
            this.newNotification({
              success: data.data.revokeToken.success,
              message: data.data.revokeToken.message,
            });
            this.props.handleLogout();
            Router.push('/');
            this.setState({ open: true });
          }
          return (
            <MenuItem onClick={revokeToken}>
              <ListItemIcon>
                <LogoutIcon />
                <ListItemText inset primary="Logout" />
              </ListItemIcon>
            </MenuItem>
          );
        }}
      </Mutation>
    );
  }
}

LogoutButton.propTypes = {
  enqueueSnackbar: PropTypes.func.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

export default withSnackbar(LogoutButton);
