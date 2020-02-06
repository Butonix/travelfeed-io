import React, { useEffect, useState } from 'react';
import Feed from '../components/Feed/Feed';
import { getUser } from '../helpers/token';
import withApollo from '../lib/withApollo';

const CustomFeed = () => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    setUser(getUser() || false);
  }, []);

  return (
    <>
      <Feed
        active="feed"
        selection={4}
        min_curation_score={0}
        orderby="created_at"
        feed={user}
        isFeed
      />
    </>
  );
};

export default withApollo(CustomFeed);
