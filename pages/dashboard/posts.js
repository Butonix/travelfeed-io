import React from 'react';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import Posts from '../../components/Dashboard/Posts';

const PostsPage = () => {
  return <DashboardPage label="posts" content={<Posts />} />;
};

export default PostsPage;
