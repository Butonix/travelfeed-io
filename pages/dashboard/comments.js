import React from 'react';
import Comments from '../../components/Dashboard/Comments';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import withApollo from '../../lib/withApollo';

const CommentsPage = () => {
  return <DashboardPage label="comments" content={<Comments />} />;
};

export default withApollo(CommentsPage);
