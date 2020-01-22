import React from 'react';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import Profile from '../../components/Dashboard/Profile';

const ProfilePage = () => {
  return <DashboardPage label="profile" content={<Profile />} />;
};

export default ProfilePage;
