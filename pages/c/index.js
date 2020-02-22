import React from 'react';
import Head from '../../components/Header/Head';
import Header from '../../components/Header/Header';
import PopupNavItems from '../../components/Header/PopupNavItems';
import withApollo from '../../lib/withApollo';

const Communities = () => {
  return (
    <>
      <Head
        title="Communities"
        description="Discover the best travel communities on TravelFeed."
      />
      <Header subheader="Communities" active="communities" />
      <div className="pt-2" />
      <PopupNavItems tags />
    </>
  );
};

export default withApollo(Communities);
