import React from 'react';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import Replies from '../../components/Dashboard/Replies';

const RepliesPage = () => {
  return <DashboardPage label="replies" content={<Replies />} />;
};

export default RepliesPage;
