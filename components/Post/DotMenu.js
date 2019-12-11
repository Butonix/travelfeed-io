import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import IconButton from '@material-ui/core/IconButton';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import EditIcon from '@material-ui/icons/Edit';
import CuratorIcon from '@material-ui/icons/MoreVert';
import React, { useEffect, useState } from 'react';
import { getRoles } from '../../helpers/token';
import AuthorBlacklist from '../CuratorMenu/Actions/AuthorBlacklist';
import PostBlacklist from '../CuratorMenu/Actions/PostBlacklist';
import FollowButton from '../Profile/FollowButton';
import BookmarkIcon from './BookmarkIcon';
import ReportDialog from './ReportDialog';
import SocialShareDialog from './SocialShareDialog';

const DotMenu = props => {
  const {
    onBmChange,
    author,
    permlink,
    tags,
    title,
    img_url,
    onEditClick,
    alwaysShowSaveBtn,
  } = props;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [listenClickAway, setListenClickAway] = React.useState(true);
  const [roles, setRoles] = useState(undefined);

  useEffect(() => {
    setRoles(getRoles());
  }, []);

  const isCurator = roles && roles.indexOf('curator') !== -1;

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'transitions-popper' : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    handleClose();
    onEditClick();
  };

  const menuItems = [];

  if (onEditClick)
    menuItems.push(
      <div className="d-block d-xl-none d-lg-none d-md-none d-sm-none">
        <MenuItem onClick={handleEditClick}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Edit" />
        </MenuItem>
      </div>,
    );

  menuItems.push(
    <div
      className={`d-block ${
        alwaysShowSaveBtn ? '' : 'd-xl-none d-lg-none d-md-none d-sm-none'
      }`}
    >
      <BookmarkIcon
        onBmChange={onBmChange}
        isMenuItem
        author={author}
        permlink={permlink}
      />
    </div>,
  );

  menuItems.push(
    <SocialShareDialog
      setListenClickAway={setListenClickAway}
      author={author}
      permlink={permlink}
      tags={tags}
      title={title}
      img_url={img_url}
    />,
  );

  menuItems.push(<FollowButton author={author} btnstyle="menuItem" />);

  if (isCurator) {
    menuItems.push(
      <AuthorBlacklist
        setListenClickAway={setListenClickAway}
        author={author}
      />,
    );
    menuItems.push(
      <PostBlacklist
        setListenClickAway={setListenClickAway}
        author={author}
        permlink={permlink}
      />,
    );
  } else
    menuItems.push(
      <>
        <ReportDialog
          setListenClickAway={setListenClickAway}
          author={author}
          permlink={permlink}
        />
      </>,
    );

  return (
    <>
      <IconButton onClick={handleClick}>
        <CuratorIcon className="textPrimary" />
      </IconButton>
      <Popper id={id} open={open} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper>
              <ClickAwayListener
                onClickAway={listenClickAway ? handleClose : undefined}
              >
                <MenuList>
                  {menuItems.map(item => {
                    return item;
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default DotMenu;
