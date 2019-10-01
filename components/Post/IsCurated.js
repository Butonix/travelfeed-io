import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import CurateIcon from '@material-ui/icons/Star';
import HonourIcon from '@material-ui/icons/StarHalf';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';

const useStyles = makeStyles(() => ({
  iconButton: {
    paddingRight: 6,
    paddingLeft: 2,
  },
}));

const IsCurated = props => {
  const classes = useStyles();
  const { app, curationScore } = props;

  return (
    <>
      {app && app.split('/')[0] === 'travelfeed' && (
        <IconButton disabled className={classes.iconButton}>
          <img
            width="25"
            alt="TravelFeed"
            className="mr-1"
            src="https://travelfeed.io/favicon.ico"
          />
        </IconButton>
      )}
      {(curationScore > 8000 && (
        <Fragment>
          <IconButton disabled className={classes.iconButton}>
            <CurateIcon />
          </IconButton>
        </Fragment>
      )) ||
        (curationScore > 4000 && (
          <Fragment>
            <IconButton disabled className={classes.iconButton}>
              <HonourIcon />
            </IconButton>
          </Fragment>
        ))}
    </>
  );
};

IsCurated.propTypes = {
  curationScore: PropTypes.number.isRequired,
  app: PropTypes.string,
};

export default IsCurated;
