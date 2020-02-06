import { useRouter } from 'next/router';
import React from 'react';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import Drafts from '../../components/Dashboard/Drafts';
import withApollo from '../../lib/withApollo';

const DraftsPage = () => {
  const router = useRouter();

  const { sortby } = router.query;

  return <DashboardPage label="drafts" content={<Drafts sortby={sortby} />} />;
};

export default withApollo(DraftsPage);
