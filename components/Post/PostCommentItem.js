import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { withStyles } from '@material-ui/styles';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import React, { Component, Fragment } from 'react';
import LazyLoad from 'vanilla-lazyload';
import parseBody from '../../helpers/parseBody';
import { getUser } from '../../helpers/token';
import Link from '../../lib/Link';
import CuratorMenu from '../CuratorMenu/CommentMenu';
import ProfileAvatar from '../Profile/ProfileAvatar';
import ProfileName from '../Profile/ProfileName';
import PostComments from './PostComments';
import SubHeader from './SubHeader';
import VoteSlider from './VoteSlider';

const styles = theme => ({
  areabg: {
    background: theme.palette.background.light,
  },
});

class PostCommentItem extends Component {
  state = {
    isEdit: false,
    showEditor: false,
    userComment: undefined,
    body: undefined,
  };

  componentDidMount() {
    const user = getUser();
    if (user === this.props.post.author) {
      this.setState({ isEdit: true });
    }
    if (!document.lazyLoadInstance) {
      document.lazyLoadInstance = new LazyLoad({
        elements_selector: '.lazy',
        threshold: 1200,
      });
    }
    document.lazyLoadInstance.update();
  }

  // Update lazyLoad after rerendering of every image
  componentDidUpdate() {
    document.lazyLoadInstance.update();
  }

  onCommentEdit = userComment => {
    this.setState({ body: userComment.body, showEditor: false });
  };

  onCommentAdd = userComment => {
    this.setState({ userComment });
  };

  handleClick = () => {
    this.setState({
      showEditor: true,
    });
  };

  render() {
    const { classes } = this.props;

    // Prevent SSR
    const BookmarkIcon = dynamic(() => import('./BookmarkIcon'), {
      ssr: false,
    });
    const htmlBody = parseBody(this.state.body || this.props.post.body, {});
    const bodyText = { __html: htmlBody };
    let children = <Fragment />;
    if (this.props.post.children !== 0 && this.props.loadreplies === true) {
      children = (
        <PostComments
          post_id={this.props.post.post_id}
          orderby={this.props.orderby}
          orderdir={this.props.orderdir}
        />
      );
    }
    let debth = 0;
    if (this.props.post.depth > 1 && this.props.loadreplies === true) {
      debth = `${String(this.props.post.depth * 20)}px`;
    }
    let title = <Fragment />;
    let appIcon = <Fragment />;
    // Set the caninical URL to travelfeed.io if the post was authored through
    // the dApp
    if (
      this.props.post.app &&
      this.props.post.app.split('/')[0] === 'travelfeed'
    ) {
      appIcon = (
        <img
          alt="TravelFeed"
          width="25"
          className="mr-1"
          src="https://travelfeed.io/favicon.ico"
        />
      );
    }
    let parent = <Fragment />;
    if (this.props.post.depth > 1) {
      parent = (
        <div>
          <Link
            color="textPrimary"
            as={`/@${this.props.post.parent_author}/${this.props.post.parent_permlink}`}
            href={`/post?author=${this.props.post.parent_author}&permlink=${this.props.post.parent_permlink}`}
            passHref
          >
            <a>
              <strong className="ablue hoverline">Go to parent comment</strong>
            </a>
          </Link>
        </div>
      );
    }
    if (this.props.title === true) {
      title = (
        <div
          className={`border p-3 mb-2 
        ${classNames(classes.areabg)}`}
        >
          <h4>{`Re: ${this.props.post.root_title}`}</h4>
          <div>
            <Link
              color="textPrimary"
              as={`/@${this.props.post.root_author}/${this.props.post.root_permlink}`}
              href={`/post?author=${this.props.post.root_author}&permlink=${this.props.post.root_permlink}`}
              passHref
            >
              <a>
                <strong className="ablue hoverline">Go to original post</strong>
              </a>
            </Link>
          </div>
          {parent}
        </div>
      );
    }
    let cardcontent = (
      // eslint-disable-next-line react/no-danger
      <div className="postcontent" dangerouslySetInnerHTML={bodyText} />
    );
    if (this.state.showEditor) {
      const CommentEditor = dynamic(() => import('../Editor/CommentEditor'), {
        ssr: false,
      });
      cardcontent = (
        <CommentEditor
          editMode
          permlink={this.props.post.permlink}
          parent_author={this.props.post.parent_author}
          parent_permlink={this.props.post.parent_permlink}
          defaultValue={this.props.post.body}
          onCommentEdit={this.onCommentEdit}
        />
      );
    }
    return (
      <Fragment>
        <Card
          className="mb-3"
          style={{ marginLeft: debth }}
          id={this.props.post.permlink}
        >
          <CardHeader
            avatar={<ProfileAvatar author={this.props.post.author} />}
            action={
              <Fragment>
                {appIcon}
                <BookmarkIcon
                  author={this.props.post.author}
                  permlink={this.props.post.permlink}
                />
                <CuratorMenu
                  author={this.props.post.author}
                  permlink={this.props.post.permlink}
                />
              </Fragment>
            }
            title={
              <ProfileName
                author={this.props.post.author}
                displayName={this.props.post.display_name}
              />
            }
            subheader={<SubHeader created_at={this.props.post.created_at} />}
          />
          <CardContent>
            {title}
            {cardcontent}
          </CardContent>
          <VoteSlider
            author={this.props.post.author}
            permlink={this.props.post.permlink}
            votes={this.props.post.votes}
            total_votes={this.props.post.total_votes}
            children={this.props.post.children}
            tags={[]}
            mode="comment"
            handleClick={this.handleClick}
            isEdit={this.state.isEdit}
            depth={this.props.post.depth}
            onCommentAdd={this.onCommentAdd}
          />
        </Card>
        {// "Fake" display new user comment after submitting comment without refreshing from the API
        this.state.userComment && (
          <PostCommentItem
            post={{
              body: this.state.userComment.body,
              created_at: new Date(),
              children: 0,
              author: getUser(),
              display_name: '',
              permlink: this.state.userComment.permlink,
              depth: this.props.post.depth + 1,
              total_votes: 0,
              votes: '',
              parent_author: '',
              parent_permlink: '',
              root_title: '',
            }}
          />
        )}
        {children}
      </Fragment>
    );
  }
}

PostCommentItem.defaultProps = {
  loadreplies: true,
  title: false,
  orderby: undefined,
  orderdir: undefined,
};

PostCommentItem.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  post: PropTypes.objectOf(PropTypes.any).isRequired,
  loadreplies: PropTypes.bool,
  title: PropTypes.bool,
  orderby: PropTypes.string,
  orderdir: PropTypes.string,
};

export default withStyles(styles, { withTheme: true })(PostCommentItem);
