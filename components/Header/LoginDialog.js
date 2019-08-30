import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { getLoginURL } from '../../helpers/token';
import ScLogo from '../../images/steemconnect.svg';
import EasyLoginButton from './EasyLoginButton';
import HrCaption from './HrCaption';
import KeychainButton from './KeychainButton';

const LoginDialog = props => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { open, handleClose } = props;
  return (
    <Fragment>
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
                Login with TravelFeed EasyLogin
              </DialogTitle>
              <DialogContent className="text-center">
                <EasyLoginButton />
                <HrCaption text="No account?" />
                <div className="pb-3">
                  <Typography
                    color="primary"
                    onClick={props.switch}
                    onKeyPress={props.switch}
                    role="link"
                    tabIndex={0}
                    className="cpointer"
                  >
                    Create your free account now
                  </Typography>
                </div>
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

LoginDialog.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};

export default LoginDialog;
