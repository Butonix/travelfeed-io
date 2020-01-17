import Button from '@material-ui/core/Button';
import { teal } from '@material-ui/core/colors';
import Skeleton from '@material-ui/lab/Skeleton';
// import Link from '../../lib/Link';
import React, { Fragment, useEffect, useState } from 'react';
import {
  nameFromCC,
  randomCountry,
  slugFromCC,
} from '../../helpers/countryCodes';
import { GET_POSTS } from '../../helpers/graphql/posts';
import graphQLClient from '../../helpers/graphQLClient';
import Link from '../../lib/Link';
import HeaderCard from '../General/HeaderCard';
import PostPreview from '../Post/PostPreview';

const DiscoverCountry = () => {
  const [country_code, setCountryCode] = useState(null);
  const [countryPosts, setCountryPosts] = useState([1, 2, 3, 4, 5]);

  useEffect(() => {
    const cc = randomCountry();
    setCountryCode(cc);
    graphQLClient(GET_POSTS, {
      country_code: cc,
      limit: 5,
      min_curation_score: 9000,
    }).then(({ posts }) => {
      setCountryPosts(posts);
    });
  }, []);

  const country_name = country_code ? nameFromCC(country_code) : '';
  const countryslug = country_code ? slugFromCC(country_code) : '';

  return (
    <Fragment>
      <HeaderCard
        noborder
        title={
          country_code ? (
            `Discover ${country_name}`
          ) : (
            <Skeleton variant="text" width="100%" height={45} divider />
          )
        }
        titlesize="h5"
        background={teal[600]}
        content={
          <div>
            {countryPosts.map(post => {
              return (
                <PostPreview
                  author={post.author}
                  permlink={post.permlink}
                  img_url={post.img_url}
                  title={post.title}
                  divider
                />
              );
            })}
            <div className="text-center pt-3 pb-3">
              <Link
                color="textPrimary"
                as={`/destinations/${countryslug}`}
                href={`/destinations?country=${countryslug}`}
              >
                <Button variant="contained" color="primary">
                  <span className="text-light">Explore More</span>
                </Button>
              </Link>
            </div>
          </div>
        }
      />
    </Fragment>
  );
};

export default DiscoverCountry;
