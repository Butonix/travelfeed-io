// Todo: Tooltip with individual voters over total miles
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import { red, teal } from '@material-ui/core/colors';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/core/Slider';
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles,
} from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CommentIcon from '@material-ui/icons/AddComment';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import EmojiIcon from '@material-ui/icons/EmojiEmotions';
import LinkIcon from '@material-ui/icons/Link';
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
    let sliderstyle = {};
    let rowitem1 =
      'col-xl-4 col-lg-5 col-md-5 col-sm-12 col-12 order-xl-1 order-lg-1 order-md-1 order-sm-2 order-2 p-0';
    let rowitem2 =
      'col-xl-8 col-lg-7 col-md-7 col-sm-12 col-12 order-2 order-xl-2 order-lg-2 order-md-2 order-sm-1 order-1 my-auto taglist p-3';
    if (this.props.mode === 'gridcard') {
      sliderstyle = { fontSize: '0.6rem' };
      rowitem1 = 'col-6 p-0 order-1';
      rowitem2 = 'col-6 p-0 text-right my-auto pr-2 order-2';
    } else if (this.props.mode === 'comment') {
      rowitem1 = 'col-12 p-0';
      rowitem2 = 'd-none';
    }
    const commentButton = (
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
          <CommentIcon className="mr mr-1" />
          {this.props.children > 0 && (
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
            {this.props.children > 0 ? 'Comments' : 'Comment'}
          </Typography>
        </Button>
      </Typography>
    );
    let cardFooter = <Fragment />;
    actions.push(
      <Fragment>
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
            <Box
              className="pl-2 pr-1"
              fontSize={16}
              color={this.state.hasVoted ? 'primary' : 'inherit'}
              fontWeight="fontWeightBold"
              component="span"
            >
              {this.state.totalmiles || this.props.total_votes}
            </Box>
            <Typography noWrap variant="inherit" className="p-1">
              Vote
            </Typography>
          </Button>
        </Typography>
      </Fragment>,
    );
    if (this.props.mode === 'gridcard') {
      actions.push(
        <Link
          color="textPrimary"
          as={`/@${this.props.author}/${this.props.permlink}#comments`}
          href={`${this.props.commentLink}#comments`}
        >
          {commentButton}
        </Link>,
      );
    } else {
      actions.push(<>{commentButton}</>);
    }
    if (this.props.mode === 'comment') {
      actions.push(
        <Link
          color="textPrimary"
          as={`/@${this.props.author}/${this.props.permlink}`}
          href={`/post?author=${this.props.author}&permlink=${this.props.permlink}`}
        >
          <Typography color="textSecondary" component="span">
            <Button fullWidth size="small" color="inherit">
              <LinkIcon />
              <Typography noWrap variant="inherit" className="pl-2 p-1">
                View
              </Typography>
            </Button>
          </Typography>
        </Link>,
      );
    }
    actions.push(
      <Typography color="textSecondary" component="span">
        <BookmarkIcon
          onBmChange={this.props.onBmChange}
          isButton
          author={this.props.author}
          permlink={this.props.permlink}
        />
      </Typography>,
    );
    if (this.props.handleClick !== undefined) {
      if (this.props.isEdit === true) {
        actions.push(
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
          </Typography>,
        );
      }
    }
    if (this.state.voteExpanded === false) {
      cardFooter = (
        <Fragment>
          <Divider variant="middle" />
          <CardActions>
            <div className="container w-100">
              <div className="row">
                {actions.map(action => {
                  return <div className="col p-0">{action}</div>;
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
                <Divider variant="middle" />
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
                        onChangeCommitted={this.votePost.bind(this)}
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
      const CommentEditor = dynamic(() => import('../Editor/CommentEditor'), {
        ssr: false,
      });
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
