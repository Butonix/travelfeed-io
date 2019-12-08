// TODO: Add form & functionality

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import CloseIcon from '@material-ui/icons/Close';
import ReportIcon from '@material-ui/icons/Flag';
import React, { useState } from 'react';

const ReportDialog = props => {
  const [open, setOpen] = useState(false);

  const { author, permlink, setListenClickAway } = props;

  const handleOpen = () => {
    setListenClickAway(false);
    setOpen(true);
  };

  const handleClose = () => {
    setListenClickAway(true);
    setOpen(false);
  };

  return (
    <>
      <MenuItem onClick={handleOpen}>
        <ListItemIcon>
          <ReportIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Report" />
      </MenuItem>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle className="text-center" id="form-dialog-title">
          Report Post
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              padding: '2px',
            }}
          >
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
        </DialogTitle>{' '}
        <DialogContent>Report</DialogContent>
      </Dialog>
    </>
  );
};

export default ReportDialog;
