import { getDataFromTree } from '@apollo/react-ssr';
import { useAmp } from 'next/amp';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import React from 'react';
import SinglePostAmp from '../../components/Amp/SinglePostAmp';
import ErrorPage from '../../components/General/ErrorPage';
import Header from '../../components/Header/Header';
import SinglePost from '../../components/Post/SinglePost';
import withApollo from '../../lib/withApollo';

export const config = { amp: 'hybrid' };

const PostPage = () => {
  const router = useRouter();

  const isAmp = useAmp();

  const post = router.query;

  if (!post.author || !post.author.match(/@/)) {
    return (
      <>
        <Header />
        <ErrorPage statusCode={404} />
      </>
    );
  }

  post.author = router.query.author.replace(/@/, '');

  return (
    <>{isAmp ? <SinglePostAmp post={post} /> : <SinglePost post={post} />}</>
  );
};

PostPage.defaultProps = {
  query: undefined,
};

PostPage.propTypes = {
  // eslint-disable-next-line react/no-unused-prop-types
  query: PropTypes.arrayOf(PropTypes.string),
};

export default withApollo(PostPage, { getDataFromTree });
