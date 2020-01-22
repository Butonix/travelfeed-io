import React from 'react';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import Notifications from '../../components/Dashboard/Notifications';

const NotificationsPage = () => {
  return <DashboardPage label="notifications" content={<Notifications />} />;
};

export default NotificationsPage;
