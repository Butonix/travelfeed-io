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
      <div className="container" id="containerInvisibleOnMobile">
        <PopupNavItems tags />
      </div>
      <style>{`
        @media (max-width: 992px) {
          #containerInvisibleOnMobile {
            padding: 0;
            margin: 0;
          }
        }
        `}</style>
    </>
  );
};

export default withApollo(Communities);
