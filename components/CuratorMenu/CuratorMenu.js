import IconButton from '@material-ui/core/IconButton';
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';
import { makeStyles } from '@material-ui/core/styles';
import CuratorIcon from '@material-ui/icons/MoreVert';
import React from 'react';

const useStyles = makeStyles(theme => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

const CuratorMenu = props => {
  const { component } = props;

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <>
      <IconButton onClick={handleClick}>
        <CuratorIcon className="textPrimary" />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <MenuList>{component}</MenuList>
      </Popover>
    </>
  );
};

export default CuratorMenu;
