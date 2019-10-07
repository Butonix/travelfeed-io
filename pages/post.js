import { useAmp } from 'next/amp';
import PropTypes from 'prop-types';
import React from 'react';
import SinglePost from '../components/Post/SinglePost';

const PostPage = props => {
  const isAmp = useAmp();

  return <>{isAmp ? <p>Amp test</p> : <SinglePost post={props} />}</>;
};

PostPage.getInitialProps = props => {
  const {
    author,
    permlink,
    title,
    body,
    display_name,
    img_url,
    lazy_img_url,
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
    lazy_img_url,
    created_at,
    depth,
  };
};

PostPage.defaultProps = {
  query: undefined,
};

PostPage.propTypes = {
  author: PropTypes.string.isRequired,
  permlink: PropTypes.string.isRequired,
  // eslint-disable-next-line react/no-unused-prop-types
  query: PropTypes.arrayOf(PropTypes.string),
};

export const config = { amp: 'hybrid' };

export default PostPage;
