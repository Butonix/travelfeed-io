import { Mutation, Query } from '@apollo/react-components';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import BlockIcon from '@material-ui/icons/Block';
import CheckIcon from '@material-ui/icons/Check';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import {
  IS_BLACKLISTED_POST,
  UNBLACKLIST_POST,
} from '../../../helpers/graphql/blacklist';
import BlacklistMenu from '../../Dashboard/Curation/BlacklistMenu';

class PostBlacklist extends React.Component {
  state = {
    reason: '',
    open: false,
  };

  handleClickOpen = () => {
    this.props.setListenClickAway(false);
    this.setState({ open: true });
  };

  handleClose = () => {
    this.props.setListenClickAway(true);
    this.setState({ open: false });
  };

  handleTextFieldChange = content => {
    this.setState({ reason: content.target.value });
  };

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
    const { author, permlink } = this.props;
    const { open } = this.state;
    return (
      <div>
        <Query
          query={IS_BLACKLISTED_POST}
          variables={{
            author,
            permlink,
          }}
        >
          {({ data }) => {
            if (
              data &&
              data.isBlacklistedPost &&
              data.isBlacklistedPost.isBlacklisted
            ) {
              const { reason } = data.isBlacklistedPost;
              return (
                <Mutation
                  mutation={UNBLACKLIST_POST}
                  variables={{
                    author,
                    permlink,
                  }}
                >
                  {// eslint-disable-next-line no-shadow
                  (unblacklistPost, data) => {
                    if (
                      data &&
                      data.data &&
                      data.data.unblacklistPost &&
                      open === true
                    ) {
                      this.newNotification({
                        success: data.data.unblacklistPost.success,
                        message: data.data.unblacklistPost.message,
                      });
                      this.setState({ open: false });
                    }
                    return (
                      <Fragment>
                        <MenuItem onClick={this.handleClickOpen}>
                          <ListItemIcon>
                            <CheckIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="Remove post from blacklist" />
                        </MenuItem>
                        <Dialog
                          open={open}
                          onClose={this.handleClose}
                          aria-labelledby="alert-dialog-title"
                          aria-describedby="alert-dialog-description"
                        >
                          <DialogTitle id="alert-dialog-title">
                            Remove post from blacklist?
                          </DialogTitle>
                          <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                              This post has been blacklisted for the following
                              reason:
                              <em>{` ${reason} `}</em>
                            </DialogContentText>
                            <DialogContentText id="alert-dialog-description">
                              Are you sure that you want to remove this post
                              from the blacklist? Note: If the author is
                              blacklisted, removing this post from the blacklist
                              will have no effect.
                            </DialogContentText>
                          </DialogContent>
                          <DialogActions>
                            <Button onClick={this.handleClose} color="primary">
                              Cancel
                            </Button>
                            <Button
                              onClick={unblacklistPost}
                              color="primary"
                              variant="contained"
                              autoFocus
                            >
                              Remove from blacklist
                            </Button>
                          </DialogActions>
                        </Dialog>
                      </Fragment>
                    );
                  }}
                </Mutation>
              );
            }
            if (
              data &&
              data.isBlacklistedPost &&
              data.isBlacklistedPost.isBlacklisted === false
            ) {
              return (
                <>
                  <MenuItem onClick={this.handleClickOpen}>
                    <ListItemIcon>
                      <BlockIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Blacklist" />
                  </MenuItem>
                  <BlacklistMenu
                    open={open}
                    onConfirm={() => this.setState({ open: false })}
                    onCancel={() => this.setState({ open: false })}
                    author={author}
                    permlink={permlink}
                    isCommentMode={this.props.isCommentMode}
                  />
                </>
              );
            }
            return (
              <MenuItem>
                <ListItemIcon />
                <ListItemText />
              </MenuItem>
            );
          }}
        </Query>
      </div>
    );
  }
}

PostBlacklist.propTypes = {
  author: PropTypes.string.isRequired,
  permlink: PropTypes.string.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
};

export default withSnackbar(PostBlacklist);
