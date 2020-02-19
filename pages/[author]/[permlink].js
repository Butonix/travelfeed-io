import { getDataFromTree } from '@apollo/react-ssr';
import { useAmp } from 'next/amp';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';
import Post from '../../components/Post/Post';
import withApollo from '../../lib/withApollo';

export const config = { amp: 'hybrid' };

const PostPage = () => {
  const router = useRouter();

  const isAmp = useAmp();

  const post = router.query;

  post.author = router.query.author.replace(/@/, '');

  return <Post post={post} isAmp={isAmp} />;
};

PostPage.defaultProps = {
  query: undefined,
};

PostPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  query: PropTypes.arrayOf(PropTypes.string),
};

export default withApollo(PostPage, { getDataFromTree });
