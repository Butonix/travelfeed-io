import { getDataFromTree } from '@apollo/react-ssr';
import Typography from '@material-ui/core/Typography';
import { useRouter } from 'next/router';
import React, { Fragment, useState } from 'react';
import PhotoDetailHeader from '../../components/General/PhotoDetailHeader';
import PostGrid from '../../components/Grid/PostGrid';
import Head from '../../components/Header/Head';
import Header from '../../components/Header/Header';
import PopupNavItems from '../../components/Header/PopupNavItems';
import { ccFromSlug, nameFromSlug } from '../../helpers/countryCodes';
import withApollo from '../../lib/withApollo';

const DestinationsPage = () => {
  const router = useRouter();

  const { destination } = router.query;
  const country = destination.length > 0 ? destination[0] : undefined;
  const subdivision = destination.length > 1 ? destination[1] : undefined;
  const city = destination.length > 2 ? destination[2] : undefined;
  const suburb = destination.length > 3 ? destination[3] : undefined;

  const [topic, setTopic] = useState(undefined);

  const countryName = nameFromSlug(country);
  const country_code = ccFromSlug(country);

  if (!country_code)
    return (
      <Fragment>
        <Head
          title="Destinations"
          description="Discover the best travel destinations on TravelFeed."
        />
        <Header subheader="Destinations" active="destinations" />
        <Typography variant="h4" className="text-center p-3">
          Popular Countries
        </Typography>
        <PopupNavItems countries />
        <Typography variant="h4" className="text-center p-3">
          Popular Places
        </Typography>
        <PopupNavItems places />
      </Fragment>
    );
  const title = `${(suburb && `${suburb}, ${city}`) ||
    (city && `${city}, ${countryName}`) ||
    (subdivision && `${subdivision}, ${countryName}`) ||
    countryName}`;
  const query = {
    limit: 9,
    orderby: 'curation_score DESC, total_votes DESC',
    orderdir: '',
    country_code,
    subdivision,
    city,
    suburb,
  };
  if (topic) query.tags = topic;
  return (
    <Fragment>
      <Header subheader={title} active="destination" />
      <PhotoDetailHeader
        countrySlug={country}
        query={{ country_code, subdivision, city }}
        title={title}
        topic={topic}
        setTopic={setTopic}
      />
      <div className="pb-2">
        <div className="container pb-2" id="containerInvisibleOnMobile">
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

export default withApollo(DestinationsPage, { getDataFromTree });
