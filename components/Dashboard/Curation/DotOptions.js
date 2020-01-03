import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Popover from '@material-ui/core/Popover';
import BackIcon from '@material-ui/icons/ArrowBackIos';
import NextIcon from '@material-ui/icons/ArrowForwardIos';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import CuratorIcon from '@material-ui/icons/MoreVert';
import EyeIcon from '@material-ui/icons/RemoveRedEye';
import { withSnackbar } from 'notistack';
import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const DotMenu = props => {
  const { handleBack, handleNext, handleFinal, sanitized } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const newNotification = notification => {
    if (notification !== undefined) {
      let variant = 'success';
      if (notification.success === false) {
        variant = 'error';
      }
      props.enqueueSnackbar(notification.message, { variant });
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const menuItems = [];

  // TODO: Reply from tf or own account

  menuItems.push(
    <CopyToClipboard
      text={sanitized}
      onCopy={() =>
        newNotification({
          success: true,
          message:
            'Post content copied to your clipboard. Check at a plagiarism checker of your choice.',
        })
      }
    >
      <MenuItem>
        <ListItemIcon>
          <EyeIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Plagiarism Check" />
      </MenuItem>
    </CopyToClipboard>,
  );

  menuItems.push(
    <MenuItem onClick={handleNext}>
      <ListItemIcon>
        <NextIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText primary="Next" />
    </MenuItem>,
  );

  menuItems.push(
    <MenuItem onClick={handleBack}>
      <ListItemIcon>
        <BackIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText primary="Back" />
    </MenuItem>,
  );

  menuItems.push(
    <MenuItem onClick={handleFinal}>
      <ListItemIcon>
        <UpIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText primary="Final" />
    </MenuItem>,
  );

  return (
    <div>
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
        <MenuList>
          {menuItems.map(item => {
            return item;
          })}
        </MenuList>
      </Popover>
    </div>
  );
};

export default withSnackbar(DotMenu);
