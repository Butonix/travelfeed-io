import React from 'react';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import Profile from '../../components/Dashboard/Profile';
import withApollo from '../../lib/withApollo';

const ProfilePage = () => {
  return <DashboardPage label="profile" content={<Profile />} />;
};

export default withApollo(ProfilePage);
