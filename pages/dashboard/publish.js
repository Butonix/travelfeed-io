import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import withApollo from '../../lib/withApollo';

const PublishPage = () => {
  const router = useRouter();

  const { open, permlink, draftId, clone } = router.query;

  const Publish = dynamic(() => import('../../components/Dashboard/Publish'), {
    ssr: false,
  });

  return (
    <DashboardPage
      includeMapbox
      open={open}
      label="publish"
      content={<Publish permlink={permlink} draftId={draftId} clone={clone} />}
    />
  );
};

export default withApollo(PublishPage);
