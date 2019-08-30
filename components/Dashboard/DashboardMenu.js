import AppBar from '@material-ui/core/AppBar';
import { indigo } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Drawer from '@material-ui/core/SwipeableDrawer';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import WalletIcon from '@material-ui/icons/AttachMoney';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import PostsIcon from '@material-ui/icons/ChromeReaderMode';
import CommentsIcon from '@material-ui/icons/Comment';
import PublishIcon from '@material-ui/icons/Create';
import DashboardIcon from '@material-ui/icons/Dashboard';
import DraftIcon from '@material-ui/icons/FileCopy';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ProfileIcon from '@material-ui/icons/Person';
import UserAddIcon from '@material-ui/icons/PersonAdd';
import RepliesIcon from '@material-ui/icons/Reply';
import SettingsIcon from '@material-ui/icons/Settings';
import { withStyles } from '@material-ui/styles';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactPiwik from 'react-piwik';
import { getRoles } from '../../helpers/token';
import Link from '../../lib/Link';
import HeaderMenu from '../Header/HeaderMenu';

const drawerWidth = 200;

const styles = theme => ({
  root: {
    display: 'flex',
  },
  paper: {
    background: theme.palette.background.dark,
  },
  appBar: {
    backgroundColor: indigo[600],
    zIndex: 201,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginLeft: 12,
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    zIndex: 200, // smaller zIndex than default in order to display editor tooltips over drawer
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  content: {
    wordWrap: 'break-word',
    wordBreak: 'break-word',
    width: `calc(100% - ${drawerWidth}px)`,
    flexGrow: 1,
  },
});
class Dashboard extends Component {
  state = { open: this.props.open === 'true', variant: 'permanent', roles: [] };

  static async getInitialProps(props) {
    const { page } = props.query;
    return { page };
  }

  componentDidMount() {
    if (window.innerWidth < 576) {
      this.setState({ open: false, variant: undefined });
    } else if (window.innerWidth < 992) {
      this.setState({ open: false, variant: 'permanent' });
    } else {
      this.setState({ open: true, variant: 'permanent' });
    }
    const roles = getRoles();
    this.setState({
      roles,
    });
  }

  handleLogout = () => {
    ReactPiwik.push(['resetUserId']);
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { classes } = this.props;
    const appbar = (
      <AppBar
        color="inherit"
        position="fixed"
        className={classNames(classes.appBar, {
          [classes.appBarShift]: this.state.open,
        })}
      >
        <div className="container-fluid" style={{ height: '65px' }}>
          <div className="row h-100">
            <div className="my-auto col-xl-11 col-lg-11 col-md-10 col-sm-9 col-9">
              <Toolbar disableGutters={!this.state.open}>
                <IconButton
                  color="inherit"
                  aria-label="Open drawer"
                  onClick={this.handleDrawerOpen}
                  className={`text-light 
                    ${classNames(classes.menuButton, {
                      [classes.hide]: this.state.open,
                    })}`}
                >
                  <MenuIcon />
                </IconButton>
                <Link color="textPrimary" href="/dashboard" passHref>
                  <a style={{ flexGrow: 1 }} className="text-light">
                    <Typography
                      variant="h6"
                      className="font-weight-bold cpointer"
                      noWrap
                    >
                      {// capitalize
                      this.props.active.charAt(0).toUpperCase() +
                        this.props.active.slice(1)}
                    </Typography>
                  </a>
                </Link>
              </Toolbar>
            </div>
            <div
              className={`my-auto 
                    'col-xl-1 col-lg-1 col-md-2 col-sm-3'} col-3 text-right`}
            >
              <HeaderMenu isDashboard handleLogout={this.handleLogout} />
            </div>
          </div>
        </div>
      </AppBar>
    );
    const drawer = (
      <Drawer
        variant={this.state.variant}
        className={classNames(classes.drawer, {
          [classes.drawerOpen]: this.state.open,
          [classes.drawerClose]: !this.state.open,
        })}
        classes={{
          paper: classNames(classes.paper, {
            [classes.drawerOpen]: this.state.open,
            [classes.drawerClose]: !this.state.open && this.state.variant,
          }),
        }}
        onOpen={this.handleDrawerOpen}
        onClose={this.handleDrawerClose}
        open={this.state.open}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={this.handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <Link
            color="textPrimary"
            href={`/dashboard?open=${this.state.open}`}
            as="/dashboard"
            passHref
          >
            <a>
              <ListItem selected={this.props.active === 'dashboard'} button>
                <ListItemIcon className={classNames(classes.listitem)}>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
            </a>
          </Link>
          <Link
            color="textPrimary"
            href={`/dashboard/publish?open=${this.state.open}`}
            as="/dashboard/publish"
            passHref
          >
            <a>
              <ListItem selected={this.props.active === 'publish'} button>
                <ListItemIcon>
                  <PublishIcon />
                </ListItemIcon>
                <ListItemText primary="Publish" />
              </ListItem>
            </a>
          </Link>
          <Link
            color="textPrimary"
            href={`/dashboard/drafts?open=${this.state.open}`}
            as="/dashboard/drafts"
            passHref
          >
            <a>
              <ListItem selected={this.props.active === 'drafts'} button>
                <ListItemIcon>
                  <DraftIcon />
                </ListItemIcon>
                <ListItemText primary="Drafts" />
              </ListItem>
            </a>
          </Link>
          <Link
            color="textPrimary"
            href={`/dashboard/posts?open=${this.state.open}`}
            as="/dashboard/posts"
            passHref
          >
            <a>
              <ListItem selected={this.props.active === 'posts'} button>
                <ListItemIcon>
                  <PostsIcon />
                </ListItemIcon>
                <ListItemText primary="Posts" />
              </ListItem>
            </a>
          </Link>
          <Link
            color="textPrimary"
            href={`/dashboard/comments?open=${this.state.open}`}
            as="/dashboard/comments"
            passHref
          >
            <a>
              <ListItem selected={this.props.active === 'comments'} button>
                <ListItemIcon>
                  <CommentsIcon />
                </ListItemIcon>
                <ListItemText primary="Comments" />
              </ListItem>
            </a>
          </Link>
          <Link
            color="textPrimary"
            href={`/dashboard/replies?open=${this.state.open}`}
            as="/dashboard/replies"
            passHref
          >
            <a>
              <ListItem selected={this.props.active === 'replies'} button>
                <ListItemIcon>
                  <RepliesIcon />
                </ListItemIcon>
                <ListItemText primary="Replies" />
              </ListItem>
            </a>
          </Link>
          <Link
            color="textPrimary"
            href={`/dashboard/notifications?open=${this.state.open}`}
            as="/dashboard/notifications"
            passHref
          >
            <a>
              <ListItem selected={this.props.active === 'notifications'} button>
                <ListItemIcon>
                  <NotificationsIcon />
                </ListItemIcon>
                <ListItemText primary="Notifications" />
              </ListItem>
            </a>
          </Link>
        </List>
        <Divider />
        <List>
          <Link
            color="textPrimary"
            href={`/dashboard/profile?open=${this.state.open}`}
            as="/dashboard/profile"
            passHref
          >
            <a>
              <ListItem selected={this.props.active === 'profile'} button>
                <ListItemIcon>
                  <ProfileIcon />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
            </a>
          </Link>
          <Link
            color="textPrimary"
            href={`/dashboard/wallet?open=${this.state.open}`}
            as="/dashboard/wallet"
            passHref
          >
            <a>
              <ListItem selected={this.props.active === 'wallet'} button>
                <ListItemIcon>
                  <WalletIcon />
                </ListItemIcon>
                <ListItemText primary="Wallet" />
              </ListItem>
            </a>
          </Link>
          <Link
            color="textPrimary"
            href={`/dashboard/settings?open=${this.state.open}`}
            as="/dashboard/settings"
            passHref
          >
            <a>
              <ListItem selected={this.props.active === 'settings'} button>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItem>
            </a>
          </Link>
        </List>
        {this.state.roles && this.state.roles.indexOf('curator') !== -1 && (
          <>
            <Divider />
            <List>
              <Link
                color="textPrimary"
                href={`/dashboard/onboarding?open=${this.state.open}`}
                as="/dashboard/onboarding"
                passHref
              >
                <a>
                  <ListItem
                    selected={this.props.active === 'onboarding'}
                    button
                  >
                    <ListItemIcon>
                      <UserAddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Onboarding" />
                  </ListItem>
                </a>
              </Link>
            </List>
          </>
        )}
      </Drawer>
    );

    return (
      <div className={classes.root}>
        {appbar}
        {drawer}
        <main className={classes.content}>{this.props.content}</main>
      </div>
    );
  }
}

Dashboard.defaultProps = {
  query: undefined,
  open: undefined,
};

Dashboard.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  query: PropTypes.objectOf(PropTypes.string),
  active: PropTypes.string.isRequired,
  content: PropTypes.element.isRequired,
  open: PropTypes.string,
};

export default withStyles(styles, { withTheme: true })(Dashboard);
