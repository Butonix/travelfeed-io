import React from 'react';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import Replies from '../../components/Dashboard/Replies';
import withApollo from '../../lib/withApollo';

const RepliesPage = () => {
  return <DashboardPage label="replies" content={<Replies />} />;
};

export default withApollo(RepliesPage);
