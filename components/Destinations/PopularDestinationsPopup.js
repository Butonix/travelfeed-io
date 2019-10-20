import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import DiscoverIcon from '@material-ui/icons/Explore';
import React, { useState } from 'react';
import Link from '../../lib/Link';

const useStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(1),
  },
}));

const PopularDestinationsPopup = props => {
  const classes = useStyles();

  const { countrySlug, destinations, subdivision } = props;

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'transitions-popper' : undefined;

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleClick}>
        <span className="pr-1">Popular Destinations</span>
        <DiscoverIcon />
      </Button>
      <Popper id={id} open={open} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
              <Paper className={classes.paper}>
                <div className="container">
                  <div className="row">
                    {destinations.map((location, index) => {
                      //   limit results
                      if (index > 11) {
                        return <></>;
                      }
                      return (
                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 col-6">
                          <Link
                            key={`${countrySlug}_${
                              location.subdivision
                                ? location.subdivision
                                : `${subdivision}_${location.city}`
                            }`}
                            color="textPrimary"
                            href={`/destinations?country=${countrySlug}&subdivision=${
                              location.subdivision
                                ? location.subdivision
                                : `${subdivision}&city=${location.city}`
                            }`}
                            as={`/destinations/${countrySlug}/${
                              location.subdivision
                                ? location.subdivision
                                : `${subdivision}/${location.city}`
                            }`}
                          >
                            <MenuItem>
                              <ListItemText
                                primary={
                                  location.city
                                    ? location.city
                                    : location.subdivision
                                }
                              />
                            </MenuItem>
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Paper>
            </ClickAwayListener>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default PopularDestinationsPopup;
