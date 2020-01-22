import React from 'react';
import Comments from '../../components/Dashboard/Comments';
import DashboardPage from '../../components/Dashboard/DashboardPage';

const CommentsPage = () => {
  return <DashboardPage label="comments" content={<Comments />} />;
};

export default CommentsPage;
