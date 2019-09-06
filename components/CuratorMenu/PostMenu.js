import Grow from '@material-ui/core/Grow';
import IconButton from '@material-ui/core/IconButton';
import MenuList from '@material-ui/core/MenuList';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import CuratorIcon from '@material-ui/icons/MoreVert';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import { getRoles } from '../../helpers/token';
import AuthorBlacklist from './Actions/AuthorBlacklist';
import CustomJson from './Actions/CustomJson';
import JsonAndContest from './Actions/JsonAndContest';
import JsonAndMutate from './Actions/JsonAndMutate';
import PostBlacklist from './Actions/PostBlacklist';

class PostMenu extends Component {
  state = {
    roles: [],
    menuopen: false,
  };

  componentDidMount() {
    const roles = getRoles();
    this.setState({
      roles,
    });
  }

  handleToggle = () => {
    this.setState(state => ({ menuopen: !state.menuopen }));
  };

  handleClose = () => {
    this.setState({ menuopen: false });
  };

  render() {
    const { roles, menuopen } = this.state;
    const { author, permlink, isTf } = this.props;
    if (roles && roles.indexOf('curator') !== -1) {
      return (
        <Fragment>
          <IconButton onClick={this.handleToggle}>
            <CuratorIcon />
          </IconButton>
          <Popper
            open={menuopen}
            anchorEl={this.anchorEl}
            transition
            disablePortal
          >
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                id="menu-list-grow"
                style={{
                  transformOrigin:
                    placement === 'bottom' ? 'center top' : 'center bottom',
                }}
              >
                <Paper>
                  <MenuList>
                    {// Give contest rewards only if post has been posted through TravelFeed
                    (isTf && (
                      <>
                        <JsonAndContest
                          author={author}
                          permlink={permlink}
                          action="curate"
                          title="Are you sure that you want to curate this post?"
                          desc="This post will be upvoted with 100% by @travelfeed and it's curation trail, resteemed and will receive a congratulation comment."
                        />
                        <JsonAndContest
                          author={author}
                          permlink={permlink}
                          action="honour"
                          title="Are you sure that you want to honour this post?"
                          desc="This post will be upvoted with 50% by @travelfeed and will receive a congratulation comment."
                        />
                      </>
                    )) || (
                      <>
                        <CustomJson
                          author={author}
                          permlink={permlink}
                          action="curate"
                          title="Are you sure that you want to curate this post?"
                          desc="This post will be upvoted with 100% by @travelfeed and it's curation trail, resteemed and will receive a congratulation comment."
                        />
                        <CustomJson
                          author={author}
                          permlink={permlink}
                          action="honour"
                          title="Are you sure that you want to honour this post?"
                          desc="This post will be upvoted with 50% by @travelfeed and will receive a congratulation comment."
                        />
                      </>
                    )}
                    <JsonAndMutate
                      author={author}
                      permlink={permlink}
                      action="short"
                      title="Are you sure that you want to mark this post as too short?"
                      desc="This post will be blacklisted and receive a comment."
                      reason="Post is under the threshold of 250 words."
                    />
                    <JsonAndMutate
                      author={author}
                      permlink={permlink}
                      action="language"
                      title="Are you sure that you want to mark this post as having less than 250 words in English?"
                      desc="This post will be blacklisted and receive a comment."
                      reason="Post is under the threshold of 250 English words."
                    />
                    <JsonAndMutate
                      author={author}
                      permlink={permlink}
                      action="copyright"
                      title="Are you sure that you want to mark this post as violating copyright?"
                      desc="This post will be blacklisted and receive a comment."
                      reason="Post is violating copyright."
                    />
                    <PostBlacklist author={author} permlink={permlink} />
                    <AuthorBlacklist author={author} />
                  </MenuList>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Fragment>
      );
    }
    return <Fragment />;
  }
}

PostMenu.propTypes = {
  author: PropTypes.string.isRequired,
  permlink: PropTypes.string.isRequired,
};

export default PostMenu;
