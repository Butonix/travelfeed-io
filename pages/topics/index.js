import React from 'react';
import Head from '../../components/Header/Head';
import Header from '../../components/Header/Header';
import PopupNavItems from '../../components/Header/PopupNavItems';
import withApollo from '../../lib/withApollo';

const Topics = () => {
  return (
    <>
      <Head
        title="Topics"
        description="Discover the best travel topics on TravelFeed."
      />
      <Header subheader="Topics" active="topics" />
      <div className="pt-2" />
      <PopupNavItems tags />
    </>
  );
};

export default withApollo(Topics);
