import { getDataFromTree } from '@apollo/react-ssr';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Feed from '../components/Feed/Feed';
import MobileDialog from '../components/Feed/MobileDialog';
import { getUser } from '../helpers/token';
import withApollo from '../lib/withApollo';

const FeaturedFeed = () => {
  const router = useRouter();

  const [isApp, setIsApp] = useState(false);

  useEffect(() => {
    setIsApp(getUser() === undefined);
  }, []);

  return (
    <>
      {isApp && router.query.utm_source === 'pwa' && <MobileDialog />}
      <Feed
        active="featured"
        selection={3}
        min_curation_score={9000}
        orderby="created_at"
      />
    </>
  );
};

export default withApollo(FeaturedFeed, { getDataFromTree });
