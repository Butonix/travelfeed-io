import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useState } from 'react';

const ConfirmClearBtn = props => {
  const [open, setOpen] = useState(false);

  const onClear = () => {
    props.onClear();
    setOpen(false);
  };

  return (
    <>
      <Button
        className="m-1"
        variant="contained"
        onClick={() => setOpen(true)}
        color="primary"
      >
        Clear
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Clear?</DialogTitle>
        <DialogContent>
          <DialogContentText>Clear the form?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button variant="contained" onClick={onClear} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmClearBtn;
