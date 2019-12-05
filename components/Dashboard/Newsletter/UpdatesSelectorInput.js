import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import { withSnackbar } from 'notistack';
import React, { useState } from 'react';
import isURL from 'validator/lib/isURL';

const UpdatesSelectorItem = props => {
  const [title, setTitle] = useState(props.title || '');
  const [image, setImage] = useState(props.image || '');
  const [text, setText] = useState(props.text || '');
  const [link, setLink] = useState(props.link || '');
  const [button, setButton] = useState(props.button || '');
  const [open, setOpen] = useState(false);

  const { updates, setUpdates, loading, setLoading, isEdit } = props;

  const newNotification = notification => {
    if (notification !== undefined) {
      let variant = 'success';
      if (notification.success === false) {
        variant = 'error';
      }
      props.enqueueSnackbar(notification.message, { variant });
    }
  };

  const addUpdate = () => {
    setLoading(true);
    if (!text || !title || (link && !button) || (button && !link)) {
      newNotification({
        message: 'Data incomplete',
        success: false,
      });
      setLoading(false);
      return;
    }
    if (link && !isURL(link, { protocols: ['http', 'https'] })) {
      newNotification({
        message: 'Link is invalid',
        success: false,
      });
      setLoading(false);
      return;
    }
    let newUpdates = updates;
    if (isEdit) newUpdates = newUpdates.filter(item => item.text !== text);
    newUpdates.push({ title, image, text, link, button });
    setUpdates(newUpdates);
    setOpen(false);
    setTimeout(() => setLoading(false), 1);
  };

  return (
    <>
      <IconButton color="primary" onClick={() => setOpen(true)}>
        {(isEdit && <EditIcon />) || <AddIcon />}
      </IconButton>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableBackdropClick
        disableEscapeKeyDown
      >
        <DialogTitle id="alert-dialog-title">
          {isEdit ? 'Edit' : 'Add'} Update
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            value={title}
            onChange={event => setTitle(event.target.value)}
            label="Title*"
            fullWidth
          />
          <TextField
            margin="dense"
            value={text}
            onChange={event => setText(event.target.value)}
            label="Text*"
            fullWidth
            multiline
          />
          <TextField
            margin="dense"
            value={image}
            onChange={event => setImage(event.target.value)}
            label="Image"
            fullWidth
          />
          <TextField
            margin="dense"
            value={link}
            onChange={event => setLink(event.target.value)}
            label="Link"
            fullWidth
          />
          <TextField
            margin="dense"
            value={button}
            onChange={event => setButton(event.target.value)}
            label="Button Text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={addUpdate}
            color="primary"
            disabled={loading}
          >
            {(isEdit && (
              <>
                <span className="textPrimary pr-2"> Edit</span>
                <EditIcon />
              </>
            )) || (
              <>
                <span className="textPrimary pr-2"> Add</span>
                <AddIcon />
              </>
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default withSnackbar(UpdatesSelectorItem);
