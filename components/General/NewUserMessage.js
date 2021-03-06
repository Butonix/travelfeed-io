import { indigo, teal } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import React, { useEffect, useState } from 'react';
import {
  getUser,
  hasCookieConsent,
  isHideNewUserMessage,
  setHideNewUserMessage,
} from '../../helpers/token';
import Link from '../../lib/Link';

const NewUserMessage = () => {
  const [open, setOpen] = useState(false);
  const [color2, setColor2] = useState(700);

  useEffect(() => {
    if (
      getUser() === undefined &&
      !isHideNewUserMessage() &&
      hasCookieConsent() === 'true'
    )
      setOpen(true);
  }, []);

  const onClose = () => {
    setOpen(false);
    setHideNewUserMessage();
  };

  return (
    <>
      {open && (
        <>
          <div
            style={{
              position: 'fixed',
              bottom: '0px',
              left: '0px',
              zIndex: 1299,
            }}
          >
            <div className="container w-100">
              <div className="row">
                <div
                  style={{ width: '20px' }}
                  className="d-none d-xl-block d-lg-block d-md-block d-sm-block"
                />
                <div
                  className="col-xl-8 col-lg-8 col-md-8 col-sm-8 col-12 text-light p-3"
                  style={{ background: indigo[700] }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      padding: '2px',
                    }}
                  >
                    <IconButton onClick={onClose} className="text-light">
                      <CloseIcon />
                    </IconButton>
                  </div>
                  <Typography variant="h6">Travel, Write, Earn</Typography>
                  <Typography variant="body1">
                    Join TravelFeed and start your own travel blog for free!
                  </Typography>
                </div>
              </div>
              <div className="row">
                <div
                  style={{ width: '20px' }}
                  className="d-none d-xl-block d-lg-block d-md-block d-sm-block"
                />
                <div className="col-xl-8 col-lg8 col-md-8 col-sm-8 col-12 p-0">
                  <Link href="/join">
                    <div
                      onClick={() => setOpen(false)}
                      onKeyDown={() => setOpen(false)}
                      className="text-light text-center font-weight-bold p-2 w-100"
                      style={{ background: teal[color2] }}
                      onMouseEnter={() => setColor2(800)}
                      onMouseLeave={() => setColor2(700)}
                      role="button"
                      tabIndex="0"
                    >
                      <Typography variant="button">Learn more</Typography>
                    </div>
                  </Link>
                </div>
                <div
                  style={{ height: '20px' }}
                  className="d-none d-xl-block d-lg-block d-md-block d-sm-block col-12 text-light"
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NewUserMessage;
