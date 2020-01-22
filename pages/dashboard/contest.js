import React from 'react';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import Contest from '../../components/Dashboard/Referral';

const ContestPage = () => {
  return <DashboardPage label="contest" content={<Contest />} />;
};

export default ContestPage;
