import { useRouter } from 'next/router';
import React, { Fragment, useState } from 'react';
import PhotoDetailHeader from '../components/General/PhotoDetailHeader';
import PostGrid from '../components/Grid/PostGrid';
import Header from '../components/Header/Header';
import { slugFromCC } from '../helpers/countryCodes';
import withApollo from '../lib/withApollo';

const LocationPage = () => {
  const router = useRouter();

  const [topic, setTopic] = useState(undefined);

  const { country_code, subdivision, city, formatted_address } = router.query;
  let locations = [];
  const location_box = [];
  if (router.query && router.query.location_box) {
    locations = router.query.location_box.split(',');
    locations.forEach(el => {
      location_box.push(parseFloat(el));
    });
  }

  const query = {
    location_box,
    country_code,
    orderby: 'curation_score DESC, total_votes DESC',
    orderdir: '',
    limit: 9,
  };
  if (topic) query.tags = topic;

  return (
    <Fragment>
      <Header active="location" />
      <PhotoDetailHeader
        noIndex
        noEdit
        query={{
          search: formatted_address,
          country_code,
          subdivision,
          city,
        }}
        title={formatted_address || 'Search'}
        countrySlug={slugFromCC(country_code)}
        topic={topic}
        setTopic={setTopic}
      />
      <div className="pb-2">
        <div className="container" id="containerInvisibleOnMobile">
          <PostGrid
            active="destination"
            query={query}
            grid={{ lg: 4, md: 4, sm: 6, xs: 12 }}
            cardHeight={200}
            poststyle="grid"
          />
        </div>
      </div>
      <style>{`
        @media (max-width: 992px) {
          #containerInvisibleOnMobile {
            padding: 0;
            margin: 0;
          }
        }
        `}</style>
    </Fragment>
  );
};

export default withApollo(LocationPage);
