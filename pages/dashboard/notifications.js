import React from 'react';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import Notifications from '../../components/Dashboard/Notifications';
import withApollo from '../../lib/withApollo';

const NotificationsPage = () => {
  return <DashboardPage label="notifications" content={<Notifications />} />;
};

export default withApollo(NotificationsPage);
