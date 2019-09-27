import Avatar from '@material-ui/core/Avatar';
import { teal } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Typography from '@material-ui/core/Typography';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import PublishIcon from '@material-ui/icons/Create';
import DashboardIcon from '@material-ui/icons/Dashboard';
import DiscoverIcon from '@material-ui/icons/Explore';
import FeedIcon from '@material-ui/icons/Favorite';
import HotIcon from '@material-ui/icons/FlightTakeoff';
import CookieIcon from '@material-ui/icons/GroupWork';
import PrivacyIcon from '@material-ui/icons/Lock';
import MapIcon from '@material-ui/icons/Map';
import MenuIcon from '@material-ui/icons/Menu';
import SettingsIcon from '@material-ui/icons/Settings';
import FeaturedIcon from '@material-ui/icons/Star';
import TermsIcon from '@material-ui/icons/Toc';
import React, { useState } from 'react';
import capitalize from '../../helpers/capitalize';
import { getUser, logout } from '../../helpers/token';
import Link from '../../lib/Link';
import Logout from '../Login/LogoutButton';
import LoginButton from './LoginButton';

const useStyles = makeStyles(theme => ({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  paper: {
    background: teal[600],
    padding: theme.spacing(3, 2),
  },
  avatar: {
    width: 60,
    height: 60,
  },
  typography: {
    fontWeight: 500,
  },
}));

export default function SwipeableTemporaryDrawer(props) {
  const [user, setUser] = useState(getUser());
  const { active } = props;

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

  const feedList = [
    {
      label: 'featured',
      as: '/featured',
      href: '/?orderby=featured',
      icon: <FeaturedIcon />,
    },
    {
      label: 'taking Off',
      as: '/hot',
      href: '/?orderby=sc_hot',
      icon: <DiscoverIcon />,
    },
    {
      label: 'new',
      as: '/created',
      href: '/?orderby=created_at',
      icon: <HotIcon />,
    },
    {
      label: 'discover',
      as: '/discover',
      href: '/?orderby=random',
      icon: <DiscoverIcon />,
    },
  ];

  const legalList = [
    { label: 'privacy', href: '/about/privacy', icon: <PrivacyIcon /> },
    { label: 'terms', href: '/about/terms', icon: <TermsIcon /> },
    { label: 'cookies', href: '/about/cookies', icon: <CookieIcon /> },
  ];

  if (user) {
    legalList.unshift({
      label: 'settings',
      as: `/dashboard/settings`,
      href: '/dashboard/settings',
      icon: <SettingsIcon />,
    });
    feedList.unshift({
      label: 'feed',
      as: '/feed',
      href: '/?orderby=feed',
      icon: <FeedIcon />,
    });
    feedList.push({
      label: 'bookmarks',
      href: '/bookmarks',
      as: '/bookmarks',
      icon: <BookmarkIcon />,
    });
  }

  const sideList = side => (
    <div className={classes.list} role="presentation">
      {(user && (
        <>
          <Paper square className={classes.paper}>
            <Link
              color="textPrimary"
              as={`/@${user}`}
              href={`/blog?author=${user}`}
              passHref
            >
              <a>
                <Avatar
                  className={`cpointer ${classes.avatar}`}
                  src={`https://steemitimages.com/u/${user}/avatar/small`}
                />
                <div className="text-light">
                  <Typography
                    variant="h6"
                    className={`pl-1 pt-2 ${classes.typography}`}
                    color="inherit"
                  >
                    {user}
                  </Typography>
                </div>
              </a>
            </Link>
          </Paper>
        </>
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
        {feedList.map((el, index) => (
          <Link color="textPrimary" href={el.href} as={el.as} passHref>
            <a>
              <ListItem selected={active === el.label} button key={el.label}>
                <ListItemIcon>{el.icon}</ListItemIcon>
                <ListItemText primary={capitalize(el.label)} />
              </ListItem>
            </a>
          </Link>
        ))}
      </List>
      <Divider />
      <List>
        {[
          {
            label: 'destinations',
            link: '/destinations',
            icon: <DiscoverIcon />,
          },
          { label: 'map', link: '/map', icon: <MapIcon /> },
        ].map((el, index) => (
          <Link color="textPrimary" href={el.link} passHref>
            <a>
              <ListItem selected={active === el.label} button key={el.label}>
                <ListItemIcon>{el.icon}</ListItemIcon>
                <ListItemText primary={capitalize(el.label)} />
              </ListItem>
            </a>
          </Link>
        ))}
      </List>
      <Divider />
      {user && (
        <>
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
        </>
      )}
      <List>
        {legalList.map((el, index) => (
          <Link color="textPrimary" href={el.href} as={el.as} passHref>
            <a>
              <ListItem selected={active === el.label} button key={el.label}>
                <ListItemIcon>{el.icon}</ListItemIcon>
                <ListItemText primary={capitalize(el.label)} />
              </ListItem>
            </a>
          </Link>
        ))}
      </List>
      <Divider />
      {user && <Logout listItem handleLogout={handleLogout} />}
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
