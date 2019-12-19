import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Switch from '@material-ui/core/Switch';
import TextField from '@material-ui/core/TextField';
import { withSnackbar } from 'notistack';
import React, { useState } from 'react';
import {
  BLACKLIST_AUTHOR,
  BLACKLIST_POST,
} from '../../../helpers/graphql/blacklist';
import graphQLClient from '../../../helpers/graphQLClient';

const BlacklistMenu = props => {
  const { open, onConfirm, onCancel, author, permlink } = props;
  const [state, setState] = useState(false);
  const [customReason, setCustomReason] = useState('');
  const [reason, setReason] = useState('');

  const newNotification = notification => {
    if (notification !== undefined) {
      let variant = 'success';
      if (notification.success === false) {
        variant = 'error';
      }
      props.enqueueSnackbar(notification.message, { variant });
    }
  };

  const handleBlacklistPost = () => {
    graphQLClient(BLACKLIST_POST, {
      author,
      permlink,
      reason: reason || customReason,
    }).then(({ blacklistPost }) => {
      newNotification(blacklistPost);
      onConfirm();
    });
  };

  const handleBlacklistAuthor = () => {
    graphQLClient(BLACKLIST_AUTHOR, {
      author,
      permlink,
      reason: reason || customReason,
    }).then(({ blacklistAuthor }) => {
      newNotification(blacklistAuthor);
      onConfirm();
    });
  };

  const handleCheckboxChange = name => event => {
    setState({ [name]: event.target.checked });
  };

  const handleTextFieldChange = content => {
    setCustomReason(content.target.value);
  };

  const handleDropdownChange = event => {
    setReason(event.target.value);
  };

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        onClose={onCancel}
      >
        <DialogTitle id="alert-dialog-title">Blacklist Post</DialogTitle>
        <DialogContent>
          {!customReason && (
            <>
              <DialogContentText>
                Choose a reason why you want to blacklist:
              </DialogContentText>
              <Select value={reason} onChange={handleDropdownChange}>
                <MenuItem value="short">Below 250 words</MenuItem>
                <MenuItem value="language">Not in English</MenuItem>
                <MenuItem value="copyright">Violating Copyright</MenuItem>
              </Select>
            </>
          )}
          {!reason && (
            <>
              <DialogContentText>Or enter a custom reasoon</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                value={customReason}
                onChange={handleTextFieldChange}
                label="Reason"
                fullWidth
              />
            </>
          )}
          <DialogContentText>Options</DialogContentText>
          <FormControlLabel
            labelPlacement="end"
            control={
              <Switch
                checked={state.isShadowBlacklist}
                onChange={handleCheckboxChange('isShadowBlacklist')}
                color="primary"
              />
            }
            label="Shadow blacklist"
          />
          <FormControlLabel
            labelPlacement="end"
            control={
              <Switch
                checked={state.isOnlyCommentBlacklisted}
                onChange={handleCheckboxChange('isOnlyCommentBlacklisted')}
                color="primary"
              />
            }
            label="Blacklist only for comments (only applies when blacklisting author)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="primary">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleBlacklistPost}
            color="primary"
          >
            Blacklist post
          </Button>
          <Button onClick={handleBlacklistAuthor} color="primary">
            Blacklist author
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default withSnackbar(BlacklistMenu);
