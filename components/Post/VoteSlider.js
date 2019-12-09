// Todo: Tooltip with individual voters over total miles
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import { red, teal } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/core/Slider';
import { createMuiTheme, MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import AddCommentIcon from '@material-ui/icons/AddComment';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import EmojiIcon from '@material-ui/icons/EmojiEmotions';
import CommentIcon from '@material-ui/icons/ModeComment';
import dynamic from 'next/dynamic';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import { vote } from '../../helpers/actions';
import { VOTE } from '../../helpers/graphql/broadcast';
import { GET_VOTE_WEIGHTS } from '../../helpers/graphql/settings';
import graphQLClient from '../../helpers/graphQLClient';
import { getRoles, getUser } from '../../helpers/token';
import Link from '../../lib/Link';
import LoginButton from '../Header/LoginButton';
import BookmarkIcon from './BookmarkIcon';
import VoteButton from './VoteButton';

const CommentEditor = dynamic(() => import('../Editor/CommentEditor'), {
  ssr: false,
});

const downVoteTheme = createMuiTheme({
  palette: {
    primary: red,
  },
});

const upVoteTheme = createMuiTheme({
  palette: {
    primary: teal,
  },
});

const EmojiSlider = withStyles({
  thumb: {
    height: 30,
    width: 30,
    backgroundColor: '#fff',
    border: '1px solid currentColor',
    marginTop: -12,
    marginLeft: -12,
    boxShadow: '#ebebeb 0px 2px 2px',
    '&:focus,&:hover,&$active': {
      boxShadow: '#ccc 0px 2px 3px 1px',
    },
  },
})(Slider);

const ValueLabelComponent = props => {
  const { children, open, value } = props;

  const popperRef = React.useRef(null);
  React.useEffect(() => {
    if (popperRef.current) {
      popperRef.current.update();
    }
  });

  return (
    <Tooltip
      PopperProps={{
        popperRef,
      }}
      open={open}
      enterTouchDelay={0}
      placement="top"
      title={value}
    >
      {children}
    </Tooltip>
  );
};

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
};

class VoteSlider extends Component {
  state = {
    loaded: false,
    voteExpanded: false,
    commentExpanded: false,
    loading: undefined,
    weight: 5,
    hasVoted: false,
    user: null,
    totalmiles: null,
    open: false,
    downvoteConfirmOpen: false,
  };

  async componentDidMount() {
    const user = getUser();
    this.setState({
      user,
      totalmiles: this.props.total_votes,
    });
    if (this.props.votes !== '' && this.props.votes !== undefined) {
      const vl = this.props.votes.split('\n');
      const votelist = [];
      vl.forEach(el => {
        const details = el.split(',');
        votelist.push({
          voter: details[0],
          rshares: details[1],
          weight: Math.round(details[2] / 1000),
        });
        if (details[0] === user) {
          this.setState({
            weight: Math.round(details[2] / 1000),
            hasVoted: true,
          });
        }
      });
    }
  }

  EmojiThumbComponent = props => {
    return (
      <span {...props}>
        {(this.state.loading !== undefined && (
          <CircularProgress
            value={this.state.loading}
            size={19}
            thickness={4}
          />
        )) || <VoteButton weight={this.state.weight} size="35" />}
      </span>
    );
  };

  pastVote = res => {
    if (!res.success) this.newNotification(res);
    else
      this.setState(prevState => ({
        hasVoted: true,
        totalmiles: prevState.totalmiles + Math.round(prevState.weight),
      }));
    this.setState({ loading: undefined });
    this.collapseVoteBar();
  };

  progress = () => {
    const { loading } = this.state;
    if (loading < 100) {
      this.setState({ loading: loading + 1 });
    } else {
      this.setState({ loading: 0 });
    }
  };

  setWeight = (event, value) => {
    this.setState({ weight: value });
  };

  expandVoteBar() {
    this.setState({ voteExpanded: true });
  }

  collapseVoteBar() {
    this.setState({ voteExpanded: false });
  }

  expandCommentBar() {
    this.setState({ commentExpanded: true });
  }

  collapseCommentBar() {
    this.setState({ commentExpanded: false });
  }

  newNotification(notification) {
    if (notification !== undefined) {
      let variant = 'success';
      if (notification.success === false) {
        variant = 'error';
      }
      this.props.enqueueSnackbar(notification.message, { variant });
    }
  }

  triggerVote() {
    if (this.state.weight > 0) this.votePost();
    else this.setState({ downvoteConfirmOpen: true });
  }

  confirmDownvote() {
    this.setState({ downvoteConfirmOpen: false });
    this.votePost();
  }

  votePost() {
    this.setState({ loading: 0 });
    const roles = getRoles();
    const weight = this.state.weight * 1000;
    const { author, permlink } = this.props;
    if (roles && roles.indexOf('easylogin') !== -1) {
      const variables = {
        author,
        permlink,
        weight,
      };
      graphQLClient(VOTE, variables)
        .then(res => {
          if (res && res.vote) this.pastVote(res.vote);
        })
        .catch(err => {
          this.newNotification({
            success: false,
            message:
              err.message === 'Failed to fetch'
                ? 'Network Error. Are you online?'
                : `Could not vote: ${err.message}`,
          });
          this.setState({ loading: undefined });
        });
    } else {
      vote(author, permlink, weight).then(res => {
        if (res) {
          this.pastVote(res);
        }
      });
    }
  }

  render() {
    const actions = [];
    const commentButton = (
      <div className="col p-0">
        <Typography color="textSecondary" component="span">
          <Button
            fullWidth
            onClick={
              this.state.user != null
                ? () => this.expandCommentBar()
                : () => this.setState({ open: true })
            }
            size="small"
            color="inherit"
          >
            {(this.props.mode === 'gridcard' && (
              <CommentIcon className="mr mr-1" />
            )) || <AddCommentIcon className="mr mr-1" />}
            {this.props.children > 0 && this.props.mode !== 'sticky' && (
              <Box
                className="pl-1 pr-1"
                fontSize={16}
                color="text.icon"
                fontWeight="fontWeightBold"
                component="span"
              >
                {this.props.children}
              </Box>
            )}
            <Typography noWrap variant="inherit" className="p-1">
              {this.props.children > 1 && this.props.mode !== 'sticky'
                ? 'Comments'
                : 'Comment'}
            </Typography>
          </Button>
        </Typography>
      </div>
    );
    let cardFooter = <Fragment />;
    actions.push(
      <div className="col p-0">
        <Typography color="textSecondary" component="span">
          <Button
            fullWidth
            onClick={
              this.state.user != null
                ? () => this.expandVoteBar()
                : () => this.setState({ open: true })
            }
            size="small"
            color={this.state.hasVoted ? 'primary' : 'inherit'}
          >
            {(this.state.hasVoted && (
              <VoteButton weight={this.state.weight} size="24" />
            )) || <EmojiIcon />}
            {this.props.mode !== 'sticky' && (
              <Box
                className="pl-2 pr-1"
                fontSize={16}
                color={this.state.hasVoted ? 'primary' : 'inherit'}
                fontWeight="fontWeightBold"
                component="span"
              >
                {this.state.totalmiles || this.props.total_votes}
              </Box>
            )}
            <Typography noWrap variant="inherit" className="p-1">
              Vote
            </Typography>
          </Button>
        </Typography>
      </div>,
    );
    if (this.props.mode === 'gridcard') {
      actions.push(
        <div className="col p-0">
          <Link
            color="textPrimary"
            as={`/@${this.props.author}/${this.props.permlink}#comments`}
            href={`${this.props.commentLink}&scrollToComments=true`}
          >
            {commentButton}
          </Link>
        </div>,
      );
    } else {
      actions.push(<>{commentButton}</>);
    }
    actions.push(
      <div className="col p-0 d-none d-xl-block d-lg-block d-md-block d-sm-block">
        <Typography color="textSecondary" component="span">
          <BookmarkIcon
            onBmChange={this.props.onBmChange}
            isButton
            author={this.props.author}
            permlink={this.props.permlink}
          />
        </Typography>
      </div>,
    );
    if (this.props.handleClick !== undefined) {
      if (this.props.isEdit === true) {
        actions.push(
          <div className="col p-0 d-none d-xl-block d-lg-block d-md-block d-sm-block">
            <Typography color="textSecondary">
              <Button
                fullWidth
                onClick={() => {
                  this.props.handleClick();
                }}
                size="small"
                color="inherit"
              >
                <EditIcon className="mr pr-1 mr-1" />
                <Typography noWrap variant="inherit" className="p-1">
                  Edit
                </Typography>
              </Button>
            </Typography>
          </div>,
        );
      }
    }
    if (this.state.voteExpanded === false) {
      cardFooter = (
        <Fragment>
          {!this.props.noDivider && <Divider variant="middle" />}
          <CardActions>
            <div className="container w-100">
              <div className="row">
                {actions.map(action => {
                  return action;
                })}
              </div>
            </div>
          </CardActions>
        </Fragment>
      );
    }
    if (this.state.voteExpanded === true) {
      cardFooter = (
        <Query query={GET_VOTE_WEIGHTS}>
          {({ data }) => {
            // set default vote weight based on preferences if not voted
            if (data && !this.state.loaded && !this.state.hasVoted) {
              if (this.props.depth === 0)
                this.setState({
                  loaded: true,
                  weight: data.preferences.defaultVoteWeight,
                });
              if (this.props.depth > 0)
                this.setState({
                  loaded: true,
                  weight:
                    (data &&
                      data.preferences &&
                      data.preferences.defaultCommentsVoteWeight) ||
                    5,
                });
            }
            return (
              <Fragment>
                {!this.props.noDivider && <Divider variant="middle" />}
                <CardActions>
                  <div className="pl-2 pr-2 w-100">
                    <MuiThemeProvider
                      theme={
                        this.state.weight < 0 ? downVoteTheme : upVoteTheme
                      }
                    >
                      <EmojiSlider
                        ValueLabelComponent={ValueLabelComponent}
                        ThumbComponent={this.EmojiThumbComponent}
                        track={false}
                        valueLabelFormat={x => {
                          const number =
                            data &&
                            data.preferences &&
                            data.preferences.useHighPrecisionVotingSlider
                              ? x
                              : Math.round(x);
                          return x > 0 ? '+' + number : number;
                        }}
                        value={this.state.weight}
                        min={-10}
                        max={10}
                        step={0.001}
                        onChange={this.setWeight}
                        onChangeCommitted={this.triggerVote.bind(this)}
                      />
                    </MuiThemeProvider>
                  </div>
                  <IconButton
                    size="small"
                    onClick={() => this.collapseVoteBar()}
                  >
                    <CloseIcon />
                  </IconButton>
                </CardActions>
              </Fragment>
            );
          }}
        </Query>
      );
    }
    if (this.props.mode !== 'gridcard' && this.state.commentExpanded === true) {
      cardFooter = (
        <Fragment>
          <Divider variant="middle" />
          <CardActions>
            <div className="w-100">
              <CommentEditor
                parent_author={this.props.author}
                parent_permlink={this.props.permlink}
                onClose={() => this.collapseCommentBar()}
                onCommentAdd={this.props.onCommentAdd}
              />
            </div>
          </CardActions>
        </Fragment>
      );
    }
    return (
      <Fragment>
        {this.state.open && (
          <LoginButton
            open={this.state.open}
            hideButtons
            onClickClose={() => this.setState({ open: false })}
            text=" to vote and reply on posts"
          />
        )}
        {cardFooter}
        <Dialog
          open={this.state.downvoteConfirmOpen}
          onClose={() => this.setState({ downvoteConfirmOpen: false })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Confirm Downvote?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure that you want to downvote this post? Downvoting
              removes rewards from this post.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.setState({ downvoteConfirmOpen: false })}
              color="primary"
            >
              Cancel
            </Button>
            <MuiThemeProvider theme={downVoteTheme}>
              <Button
                variant="contained"
                onClick={this.confirmDownvote.bind(this)}
                color="primary"
              >
                Downvote
              </Button>
            </MuiThemeProvider>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

VoteSlider.defaultProps = {
  handleClick: undefined,
  isEdit: undefined,
  onCommentAdd: undefined,
  children: 0,
};

VoteSlider.propTypes = {
  onCommentAdd: PropTypes.func,
  children: PropTypes.number,
  author: PropTypes.string.isRequired,
  permlink: PropTypes.string.isRequired,
  votes: PropTypes.string.isRequired,
  total_votes: PropTypes.number.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  mode: PropTypes.string.isRequired,
  enqueueSnackbar: PropTypes.func.isRequired,
  handleClick: PropTypes.func,
  isEdit: PropTypes.bool,
  depth: PropTypes.number.isRequired,
};

export default withSnackbar(VoteSlider);
