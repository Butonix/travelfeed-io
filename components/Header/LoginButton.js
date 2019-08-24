import Button from '@material-ui/core/Button';
import { grey } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CloseIcon from '@material-ui/icons/Close';
import LoginIcon from '@material-ui/icons/VpnKey';
import { withStyles } from '@material-ui/styles';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { Fragment, useState } from 'react';
import { getLoginURL } from '../../helpers/token';
import ScLogo from '../../images/steemconnect.svg';
import EasyLoginButton from './EasyLoginButton';
import KeychainButton from './KeychainButton';

const styles = () => ({
  whitebutton: {
    color: grey[200],
    borderColor: grey[200],
  },
});

const LoginButton = props => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleMenuClickOpen = () => {
    props.onClickOpen();
    handleClickOpen();
  };

  const handleClose = () => {
    if (props.onClickClose) props.onClickClose();
    setOpen(false);
  };

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { classes } = props;
  return (
    <Fragment>
      {(props.isMenu && (
        <MenuItem onClick={handleMenuClickOpen}>
          <ListItemIcon>
            <LoginIcon />
          </ListItemIcon>
          <ListItemText primary="Login" />
        </MenuItem>
      )) || (
        <Button
          color="default"
          className={`ml-1 p-2 ${classes.whitebutton}`}
          onClick={handleClickOpen}
        >
          Login
        </Button>
      )}
      <Dialog
        maxWidth="md"
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle>
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
        </DialogTitle>
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
              <DialogTitle className="text-center" id="form-dialog-title">
                Login with TravelFeed
              </DialogTitle>
              <DialogContent className="text-center">
                <EasyLoginButton />
              </DialogContent>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12 hrright">
              <DialogTitle className="text-center" id="form-dialog-title">
                Login with Steem
              </DialogTitle>
              <DialogContent className="text-center">
                <KeychainButton />
                <div className="container">
                  <div className="row pt-4">
                    <div className="col-12 pb-2">
                      <a href={getLoginURL}>
                        <Button
                          fullsize
                          onClick={handleClose}
                          color="secondary"
                          variant="contained"
                          size="large"
                        >
                          <img
                            src={ScLogo}
                            alt="Login with Steemconnect"
                            height={30}
                          />
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </div>
            <style jsx>{`
              .hrright {
                border-width: 1px;
                border-style: solid;
                border-image: linear-gradient(
                    to bottom,
                    transparent,
                    rgba(129, 128, 120, 0.3),
                    transparent
                  )
                  1 100%;
              }
            `}</style>
          </div>
        </div>
      </Dialog>
    </Fragment>
  );
};

LoginButton.defaultProps = {
  isMenu: false,
  onClickOpen: undefined,
  onClickClose: undefined,
};

LoginButton.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  isMenu: PropTypes.bool,
  enqueueSnackbar: PropTypes.func.isRequired,
  onClickOpen: PropTypes.func,
  onClickClose: PropTypes.func,
};

export default withSnackbar(withStyles(styles)(LoginButton));
