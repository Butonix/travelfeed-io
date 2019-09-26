import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import PublishIcon from '@material-ui/icons/Create';
import DashboardIcon from '@material-ui/icons/Dashboard';
import DestinationsIcon from '@material-ui/icons/Explore';
import CookieIcon from '@material-ui/icons/GroupWork';
import PrivacyIcon from '@material-ui/icons/Lock';
import MapIcon from '@material-ui/icons/Map';
import MenuIcon from '@material-ui/icons/Menu';
import TermsIcon from '@material-ui/icons/Toc';
import React, { useState } from 'react';
import { getUser, logout } from '../../helpers/token';
import Link from '../../lib/Link';
import Logout from '../Login/LogoutButton';
import LoginButton from './LoginButton';

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export default function SwipeableTemporaryDrawer(props) {
  const [user, setUser] = useState(getUser());

  const handleLogout = () => {
    logout();
    setUser(undefined);
    props.handleLogout();
  };

  const classes = useStyles();
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (side, open) => event => {
    if (
      event &&
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [side]: open });
  };

  const sideList = side => (
    <div className={classes.list} role="presentation">
      {(user && (
        <List>
          {[
            {
              label: 'TravelBlog',
              link: '/dashboard',
              icon: <DashboardIcon />,
            },
            {
              label: 'New Post',
              link: '/dashboard/publish',
              icon: <PublishIcon />,
            },
            { label: 'Bookmarks', link: '/bookmarks', icon: <BookmarkIcon /> },
          ].map((el, index) => (
            <Link color="textPrimary" href={el.link} passHref>
              <a>
                <ListItem button key={el.label}>
                  <ListItemIcon>{el.icon}</ListItemIcon>
                  <ListItemText primary={el.label} />
                </ListItem>
              </a>
            </Link>
          ))}
        </List>
      )) || (
        <LoginButton
          isList
          isMenu
          onClickOpen={() => {}}
          onClickClose={() => {}}
        />
      )}
      <Divider />
      <List>
        {[
          {
            label: 'Destinations',
            link: '/destinations',
            icon: <DestinationsIcon />,
          },
          { label: 'Map', link: '/map', icon: <MapIcon /> },
        ].map((el, index) => (
          <Link color="textPrimary" href={el.link} passHref>
            <a>
              <ListItem button key={el.label}>
                <ListItemIcon>{el.icon}</ListItemIcon>
                <ListItemText primary={el.label} />
              </ListItem>
            </a>
          </Link>
        ))}
      </List>
      <Divider />
      <List>
        {[
          { label: 'Privacy', link: '/about/privacy', icon: <PrivacyIcon /> },
          { label: 'Terms', link: '/about/terms', icon: <TermsIcon /> },
          { label: 'Cookies', link: '/about/cookies', icon: <CookieIcon /> },
        ].map((el, index) => (
          <Link color="textPrimary" href={el.link} passHref>
            <a>
              <ListItem button key={el.label}>
                <ListItemIcon>{el.icon}</ListItemIcon>
                <ListItemText primary={el.label} />
              </ListItem>
            </a>
          </Link>
        ))}
      </List>
      {user && (
        <>
          <Divider />
          <Logout listItem handleLogout={handleLogout} />
        </>
      )}
    </div>
  );

  return (
    <div>
      <MenuIcon onClick={toggleDrawer('left', true)} className="text-light" />
      <SwipeableDrawer
        open={state.left}
        onClose={toggleDrawer('left', false)}
        onOpen={toggleDrawer('left', true)}
      >
        {sideList('left')}
      </SwipeableDrawer>
    </div>
  );
}
