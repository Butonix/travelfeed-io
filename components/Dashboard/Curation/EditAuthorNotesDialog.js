import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import EditIcon from '@material-ui/icons/Edit';
import { withSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { ADD_CURATION_AUTHOR_NOTES } from '../../../helpers/graphql/curation';
import graphQLClient from '../../../helpers/graphQLClient';

const EditAuthorNotesDialog = props => {
  const { author, initialNotes, initialAttentionLevel } = props;

  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(initialNotes || '');
  const [attentionLevel, setAttentionLevel] = useState(initialAttentionLevel);

  useEffect(() => {
    setNotes(props.initialNotes);
    setAttentionLevel(props.initialAttentionLevel);
  }, [props]);

  const newNotification = notification => {
    if (notification !== undefined) {
      let variant = 'success';
      if (notification.success === false) {
        variant = 'error';
      }
      props.enqueueSnackbar(notification.message, { variant });
    }
  };

  const handleSave = () => {
    const variables = { author, notes, attentionLevel };
    graphQLClient(ADD_CURATION_AUTHOR_NOTES, variables).then(res => {
      newNotification(res.addCurationAuthorNotes);
    });
    setOpen(false);
  };

  return (
    <>
      <IconButton color="inherit" onClick={() => setOpen(true)}>
        <EditIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Edit Author Notes for @{author}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <>
              <TextField
                label="Notes"
                fullWidth
                multiline
                value={notes}
                onChange={val => setNotes(val.target.value)}
              />
              <InputLabel htmlFor="budget-score-helper" className="pt-2">
                Attention level
              </InputLabel>
              <Select
                value={attentionLevel}
                onChange={event => setAttentionLevel(event.target.value)}
              >
                <MenuItem value={1}>Low risk</MenuItem>
                <MenuItem value={2}>Medium risk</MenuItem>
                <MenuItem value={3}>High risk</MenuItem>
              </Select>
            </>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!attentionLevel || !notes}
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default withSnackbar(EditAuthorNotesDialog);
