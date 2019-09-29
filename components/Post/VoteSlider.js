// Todo: Tooltip with individual voters over total miles
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/core/Slider';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CommentIcon from '@material-ui/icons/AddComment';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import FlightVotedIcon from '@material-ui/icons/Flight';
import FlightIcon from '@material-ui/icons/FlightTakeoff';
import LinkIcon from '@material-ui/icons/Link';
import dynamic from 'next/dynamic';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { Query } from 'react-apollo';
import { GET_VOTE_WEIGHTS } from '../../helpers/graphql/settings';
import { getUser } from '../../helpers/token';
import Link from '../../lib/Link';
import SliderTags from './SliderTags';
import VoteButton from './VoteButton';

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

  pastVote = res => {
    if (!res.success) this.newNotification(res);
    else
      this.setState(prevState => ({
        hasVoted: true,
        totalmiles: prevState.totalmiles + prevState.weight,
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
    let cardFooter = <Fragment />;
    let voteButton = (
      <Link color="textPrimary" href="/join" passHref>
        <Tooltip title="Log in to vote" placement="bottom">
          <IconButton aria-label="Upvote">
            <FlightIcon className="mr" />
          </IconButton>
        </Tooltip>
      </Link>
    );
    if (this.state.user != null) {
      voteButton = (
        <Tooltip title="Upvote" placement="bottom">
          <IconButton aria-label="Upvote" onClick={() => this.expandVoteBar()}>
            <FlightIcon className="mr" />
          </IconButton>
        </Tooltip>
      );
    }
    if (this.state.hasVoted === true) {
      voteButton = (
        <Tooltip title="Upvote" placement="bottom">
          <IconButton
            aria-label="Upvote"
            onClick={() => this.expandVoteBar()}
            color="primary"
          >
            <FlightVotedIcon className="mr" />
          </IconButton>
        </Tooltip>
      );
    }
    actions.push(
      <Fragment>
        {voteButton}
        <Typography
          component="div"
          display="inline"
          color="inherit"
          className="pr-2"
        >
          <Box
            fontSize={16}
            className="pl-1"
            color="text.icon"
            fontWeight="fontWeightBold"
            component="span"
          >
            {this.state.totalmiles || this.props.total_votes}
          </Box>
        </Typography>
      </Fragment>,
    );
    let numberreplies = '';
    if (this.props.children !== 0)
      numberreplies = (
        <Typography
          component="div"
          display="inline"
          className="pr-2 d-none d-xl-block d-lg-block d-md-block d-sm-block"
        >
          <Box
            fontSize={16}
            color="text.icon"
            fontWeight="fontWeightBold"
            component="span"
          >
            {this.props.children}
          </Box>
        </Typography>
      );
    if (this.props.mode !== 'gridcard') {
      if (this.state.user != null) {
        actions.push(
          <Typography color="textSecondary" component="span">
            <Button
              onClick={() => this.expandCommentBar()}
              size="small"
              color="inherit"
            >
              <CommentIcon className="mr pr-1 mr-1" />
              {numberreplies} Comment
            </Button>
          </Typography>,
        );
      } else {
        actions.push(
          <Typography color="textSecondary" component="span">
            <Link color="textSecondary" href="/join" passHref>
              <Button size="small" color="inherit">
                <CommentIcon className="mr pr-1 mr-1" />
                {numberreplies} Comment
              </Button>
            </Link>
          </Typography>,
        );
      }
    }
    if (this.props.mode === 'comment') {
      actions.push(
        <Link
          color="textPrimary"
          as={`/@${this.props.author}/${this.props.permlink}`}
          href={`/post?author=${this.props.author}&permlink=${this.props.permlink}`}
          passHref
        >
          <Tooltip title="Link to comment" placement="bottom">
            <IconButton aria-label="Link">
              <LinkIcon className="mr" />
            </IconButton>
          </Tooltip>
        </Link>,
      );
    }
    if (this.props.handleClick !== undefined) {
      if (this.props.isEdit === true) {
        actions.push(
          <Typography color="textSecondary">
            <Button
              onClick={() => {
                this.props.handleClick();
              }}
              size="small"
              color="inherit"
            >
              <EditIcon className="mr pr-1 mr-1" />
              Edit
            </Button>
          </Typography>,
        );
      }
    }
    if (this.state.voteExpanded === false) {
      cardFooter = (
        <Fragment>
          <Divider variant="middle" />
          <div className="container-fluid">
            <div className="row">
              <SliderTags
                cutTags={this.props.mode === 'gridcard'}
                sliderstyle={sliderstyle}
                classes={rowitem2}
                tags={this.props.tags}
              />
              <div className={rowitem1}>
                {this.props.mode !== 'gridcard' &&
                  this.props.mode !== 'comment' && (
                    <div className="d-block d-sm-block d-xl-none d-lg-none d-md-none">
                      <Divider />
                    </div>
                  )}
                <CardActions disableSpacing>
                  {actions.map(action => {
                    return <div className="actionli">{action}</div>;
                  })}
                </CardActions>
              </div>
              <style jsx>{`
                .actionli::after {
                  content: '•';
                  color: #ccc;
                  top: 1px;
                }
                .actionli:last-child:after {
                  content: '';
                }
              `}</style>
            </div>
          </div>
        </Fragment>
      );
    }
    let weightIndicator = (
      <Typography component="div" display="inline" className="pr-1">
        <Box
          fontSize={16}
          color="text.icon"
          fontWeight="fontWeightBold"
          component="span"
        >
          {this.state.weight}
        </Box>
      </Typography>
    );
    if (this.state.loading !== undefined) {
      weightIndicator = (
        <CircularProgress value={this.state.loading} size={19} thickness={4} />
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
                {this.props.mode !== 'gridcard' &&
                  this.props.mode !== 'comment' && (
                    <div className="d-block d-sm-block d-xl-none d-lg-none d-md-none">
                      <Divider variant="middle" />
                      <SliderTags
                        cutTags={this.props.mode === 'gridcard'}
                        sliderstyle={sliderstyle}
                        classes={rowitem2}
                        tags={this.props.tags}
                      />
                    </div>
                  )}
                <Divider variant="middle" />
                <CardActions>
                  <Tooltip title="Upvote now" placement="bottom">
                    <VoteButton
                      author={this.props.author}
                      permlink={this.props.permlink}
                      weight={this.state.weight}
                      pastVote={success => this.pastVote(success)}
                      setLoading={() => this.setState({ loading: 0 })}
                    />
                  </Tooltip>
                  <div className="pr-2">{weightIndicator}</div>
                  <Slider
                    value={this.state.weight}
                    min={1}
                    max={10}
                    step={1}
                    onChange={this.setWeight}
                  />
                  <Tooltip title="Close" placement="bottom">
                    <IconButton onClick={() => this.collapseVoteBar()}>
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
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
            <Tooltip title="Close" placement="bottom">
              <IconButton onClick={() => this.collapseCommentBar()}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </CardActions>
        </Fragment>
      );
    }
    return <Fragment>{cardFooter}</Fragment>;
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
