import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import SwitchIcon from '@material-ui/icons/CompareArrows';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';

class SwitchEditorModeButton extends Component {
  state = {
    open: false,
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  switch = () => {
    this.props.switchMode();
    this.setState({ open: false });
  };

  render() {
    const { open } = this.state;

    return (
      <Fragment>
        <Button
          onClick={
            (!this.props.codeEditor && this.handleClickOpen) ||
            this.props.switchMode
          }
          color="inherit"
          className="p-0 pr-2 pl-2"
        >
          <span className="pr-1">
            Switch to{' '}
            {(this.props.codeEditor && 'Easy Editor') || 'HTML+Markdown editor'}
          </span>
        </Button>
        <Dialog
          open={open}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Switch to HTML+Markdown Editor?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              We recommend using the EasyEditor. If you would like to add a
              small HTML snippet, you can do so in EasyEditor by adding a new
              paragraph, clicking + and adding a Code block. <br />
              <br /> If you switch to the HTML+Markdown editor, your post
              contents will be converted to a Code block if you decide to switch
              back to EasyEditor.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary" autoFocus>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={this.switch}>
              <SwitchIcon />
              <span className="pl-2">Switch anyway</span>
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

SwitchEditorModeButton.propTypes = {
  codeEditor: PropTypes.bool.isRequired,
  switchMode: PropTypes.func.isRequired,
};

export default SwitchEditorModeButton;
