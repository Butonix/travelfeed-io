import React from 'react';
import Feed from '../components/Feed/Feed';
import withApollo from '../lib/withApollo';

const CreatedFeed = () => {
  return (
    <Feed
      active="new"
      selection={0}
      min_curation_score={0}
      orderby="created_at"
    />
  );
};

export default withApollo(CreatedFeed);
