import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import AddIcon from '@material-ui/icons/Add';
import { withSnackbar } from 'notistack';
import React, { useState } from 'react';
import postExists from '../../../helpers/postExists';

const PostSelectorItem = props => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [permlink, setPermlink] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { posts, setPosts } = props;

  const newNotification = notification => {
    if (notification !== undefined) {
      let variant = 'success';
      if (notification.success === false) {
        variant = 'error';
      }
      props.enqueueSnackbar(notification.message, { variant });
    }
  };

  const addPost = () => {
    setLoading(true);
    if (!author || !permlink || !title || !excerpt) {
      newNotification({
        message: 'Data incomplete',
        success: false,
      });
      setLoading(false);
      return;
    }
    postExists(author, permlink).then(res => {
      if (res) {
        const newPosts = posts;
        newPosts.push({ title, author, permlink, excerpt });
        setPosts(newPosts);
        setOpen(false);
      } else
        newNotification({
          message: 'Post does not exist',
          success: false,
        });
      setLoading(false);
    });
  };

  return (
    <>
      <IconButton color="primary" onClick={() => setOpen(true)}>
        <AddIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        disableBackdropClick
        disableEscapeKeyDown
      >
        <DialogTitle id="alert-dialog-title">Add post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            value={title}
            onChange={event => setTitle(event.target.value)}
            label="Title"
            fullWidth
          />
          <TextField
            margin="dense"
            value={author}
            onChange={event => setAuthor(event.target.value)}
            label="Author"
            fullWidth
          />
          <TextField
            margin="dense"
            value={permlink}
            onChange={event => setPermlink(event.target.value)}
            label="Permlink"
            fullWidth
          />
          <TextField
            margin="dense"
            value={excerpt}
            onChange={event => setExcerpt(event.target.value)}
            label="Excerpt"
            fullWidth
            multiline
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={addPost}
            color="primary"
            disabled={loading}
          >
            <span className="textPrimary pr-2"> Add</span>
            <AddIcon />
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default withSnackbar(PostSelectorItem);
