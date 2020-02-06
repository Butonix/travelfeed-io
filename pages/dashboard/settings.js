import React from 'react';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import Settings from '../../components/Dashboard/Settings';
import withApollo from '../../lib/withApollo';

const SettingsPage = () => {
  return <DashboardPage label="settings" content={<Settings />} />;
};

export default withApollo(SettingsPage);
