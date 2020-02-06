import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import CurateIcon from '@material-ui/icons/Star';
import EmptyIcon from '@material-ui/icons/StarBorder';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles(() => ({
  iconButton: {
    marginLeft: '-3px',
    paddingBottom: '3px',
  },
}));

const IsCurated = props => {
  const classes = useStyles();
  const { curationScore, isTf } = props;

  if (!isTf && curationScore < 9000) return <></>;
  return (
    <>
      <Tooltip
        placement="bottom"
        title={
          (curationScore >= 9000 &&
            `Top pick ${isTf ? 'and TravelFeed.io Original' : ''}`) ||
          'TravelFeed.io Original'
        }
      >
        <div className="d-inline">
          <IconButton
            size="small"
            edge="start"
            disabled
            className={classes.iconButton}
          >
            {(curationScore >= 9000 && (
              <CurateIcon
                className={classes.iconButton}
                color={isTf ? 'primary' : undefined}
              />
            )) || <EmptyIcon className={classes.iconButton} color="primary" />}
          </IconButton>
        </div>
      </Tooltip>
      <span>· </span>
    </>
  );
};

IsCurated.propTypes = {
  curationScore: PropTypes.number.isRequired,
};

export default IsCurated;
