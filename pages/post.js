import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SinglePost from '../components/Post/SinglePost';

class PostPage extends Component {
  static async getInitialProps(props) {
    const {
      author,
      permlink,
      title,
      body,
      display_name,
      img_url,
      created_at,
      depth,
    } = props.query;
    return {
      author,
      permlink,
      title,
      body,
      display_name,
      img_url,
      created_at,
      depth,
    };
  }

  render() {
    return <SinglePost post={this.props} />;
  }
}

PostPage.defaultProps = {
  query: undefined,
};

PostPage.propTypes = {
  author: PropTypes.string.isRequired,
  permlink: PropTypes.string.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  query: PropTypes.arrayOf(PropTypes.string),
};

export default PostPage;
