import React from 'react';
import Feed from '../components/Feed/Feed';

const FeaturedFeed = () => {
  return (
    <Feed
      active="featured"
      selection={3}
      min_curation_score={9000}
      orderby="created_at"
    />
  );
};

FeaturedFeed.getInitialProps = () => {};

export default FeaturedFeed;
