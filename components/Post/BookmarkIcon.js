import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import BookmarkIconFilled from '@material-ui/icons/Bookmark';
import BookmarkIconBorder from '@material-ui/icons/BookmarkBorder';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Mutation, Query } from 'react-apollo';
import {
  ADD_BOOKMARK,
  DELETE_BOOKMARK,
  IS_BOOKMARKED,
} from '../../helpers/graphql/bookmarks';

const BookmarkIcon = props => {
  return (
    <Fragment>
      <Query
        fetchPolicy="network-only"
        query={IS_BOOKMARKED}
        variables={{
          author: props.author,
          permlink: props.permlink,
        }}
      >
        {({ data, loading, error }) => {
          if (loading || error) {
            return <Fragment />;
          }
          if (data.isBookmarked) {
            return (
              <IsBookmarked
                author={props.author}
                permlink={props.permlink}
                onBmChange={props.onBmChange}
              />
            );
          }
          return (
            <IsNotBookmarked
              author={props.author}
              permlink={props.permlink}
              onBmChange={props.onBmChange}
            />
          );
        }}
      </Query>
    </Fragment>
  );
};

const IsBookmarked = props => {
  return (
    <Mutation
      mutation={DELETE_BOOKMARK}
      variables={{
        author: props.author,
        permlink: props.permlink,
      }}
    >
      {(deleteBookmark, data) => {
        if (data.data && data.data.deleteBookmark.success) {
          if (props.onBmChange !== undefined) {
            props.onBmChange();
          }
          return (
            <IsNotBookmarked
              author={props.author}
              permlink={props.permlink}
              onBmChange={props.onBmChange}
            />
          );
        }
        return (
          <Tooltip title="Remove bookmark" placement="bottom">
            <IconButton onClick={deleteBookmark}>
              <BookmarkIconFilled />
            </IconButton>
          </Tooltip>
        );
      }}
    </Mutation>
  );
};

const IsNotBookmarked = props => {
  return (
    <Mutation
      mutation={ADD_BOOKMARK}
      variables={{
        author: props.author,
        permlink: props.permlink,
      }}
    >
      {(addBookmark, data) => {
        if (data.data && data.data.addBookmark.success) {
          if (props.onBmChange !== undefined) {
            props.onBmChange();
          }
          return (
            <IsBookmarked
              author={props.author}
              permlink={props.permlink}
              onBmChange={props.onBmChange}
            />
          );
        }
        return (
          <Tooltip title="Add bookmark" placement="bottom">
            <IconButton onClick={addBookmark}>
              <BookmarkIconBorder />
            </IconButton>
          </Tooltip>
        );
      }}
    </Mutation>
  );
};

BookmarkIcon.defaultProps = {
  onBmChange: undefined,
};

BookmarkIcon.propTypes = {
  author: PropTypes.string.isRequired,
  permlink: PropTypes.string.isRequired,
  onBmChange: PropTypes.func,
};

IsNotBookmarked.defaultProps = {
  onBmChange: undefined,
};

IsNotBookmarked.propTypes = {
  author: PropTypes.string.isRequired,
  permlink: PropTypes.string.isRequired,
  onBmChange: PropTypes.func,
};

IsBookmarked.defaultProps = {
  onBmChange: undefined,
};

IsBookmarked.propTypes = {
  author: PropTypes.string.isRequired,
  permlink: PropTypes.string.isRequired,
  onBmChange: PropTypes.func,
};

export default BookmarkIcon;
