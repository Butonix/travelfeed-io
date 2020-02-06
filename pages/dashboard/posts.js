import React from 'react';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import Posts from '../../components/Dashboard/Posts';
import withApollo from '../../lib/withApollo';

const PostsPage = () => {
  return <DashboardPage label="posts" content={<Posts />} />;
};

export default withApollo(PostsPage);
