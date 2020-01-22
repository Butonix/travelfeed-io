import React from 'react';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import Stats from '../../components/Dashboard/Stats';

const StatsPage = () => {
  return <DashboardPage label="dashboard" content={<Stats />} />;
};

export default StatsPage;
