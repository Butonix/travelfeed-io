import React from 'react';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import Wallet from '../../components/Dashboard/Wallet';

const WalletPage = () => {
  return <DashboardPage label="wallet" content={<Wallet />} />;
};

export default WalletPage;
