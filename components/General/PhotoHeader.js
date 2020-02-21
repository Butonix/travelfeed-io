import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import MapIcon from '@material-ui/icons/Map';
import React from 'react';
import ProgressiveImage from 'react-progressive-image';
import { getBudgetScore } from '../../helpers/budgetScore';
import Link from '../../lib/Link';
import PopularDestinationsPopup from '../Destinations/PopularDestinationsPopup';
import EditLocationDetails from './EditLocationDetails';
import TopicSelector from './TopicSelector';

const PhotoHeader = props => {
  const {
    title,
    description,
    image,
    query,
    countrySlug,
    tag,
    subtitle,
    countryName,
    locationDetails,
  } = props;

  const innerCard = (
    <>
      <div className="container h-100">
        <div
          className="row h-100 justify-content-center"
          style={{ minHeight: '400px' }}
        >
          <div className="col-xl-7 col-lg-8 col-md-9 col-sm-10 col-12 my-auto">
            <Typography
              variant="h6"
              align="center"
              className="text-light font-weight-bold"
              style={{
                textShadow: '1px 1px 20px #343A40',
              }}
              component="h5"
            >
              {// For cities, display breadcrumbs to Country and Subdivison. Else, display Knowledge Graph subtitle, if unavailable country name
              (tag && props.communityTag
                ? `c/${tag.substring(5, 11)}`
                : `#${tag}`) ||
                (query.city && (
                  <span>
                    <Link
                      color="textPrimary"
                      as={`/destinations/${countrySlug}/`}
                      href="/destinations/[...destination]"
                    >
                      <span className="text-light font-weight-bold">
                        {countryName}
                      </span>
                    </Link>
                    <span className="text-light">
                      {' '}
                      &raquo;{' '}
                      <Link
                        color="textPrimary"
                        as={`/destinations/${countrySlug}/${query.subdivision}`}
                        href="/destinations/[...destination]"
                      >
                        <span className="text-light font-weight-bold">
                          {query.subdivision}
                        </span>
                      </Link>
                    </span>{' '}
                  </span>
                )) ||
                (((query.search && !query.country_code) ||
                  query.subdivision ||
                  query.city) && (
                  <Link
                    color="textPrimary"
                    as={`/destinations/${countrySlug}/`}
                    href="/destinations/[...destination]"
                  >
                    <span className="text-light font-weight-bold">
                      {subtitle}
                    </span>
                  </Link>
                ))}
              {!props.noEdit && (
                <EditLocationDetails
                  country_code={props.query.country_code}
                  subdivision={props.query.subdivision}
                  city={props.query.city}
                  tag={tag}
                  data={locationDetails || { title, description, image }}
                />
              )}
            </Typography>
            <Typography
              gutterBottom
              variant="h2"
              component="h1"
              className="text-light font-weight-bold text-center"
              style={{
                textShadow: '1px 1px 10px #343A40',
              }}
            >
              {title}
            </Typography>
            <Typography
              gutterBottom
              className="lead text-light text-center"
              variant="h6"
              style={{
                textShadow: '1px 1px 10px black',
              }}
            >
              <em>
                {description ||
                  (locationDetails && locationDetails.description) || (
                    <>
                      <br />
                      <br />
                    </>
                  )}
              </em>
            </Typography>
            <div className="text-center">
              {!tag && !props.hideButtons && (
                <>
                  <Link href={`/map?search=${title}`}>
                    <Button className="m-2" variant="contained" color="primary">
                      <span className="pr-1">Explore the map</span>
                      <MapIcon />
                    </Button>
                  </Link>
                </>
              )}
              {locationDetails &&
                locationDetails.sublocations &&
                locationDetails.sublocations.length > 1 && (
                  <PopularDestinationsPopup
                    title={title}
                    countrySlug={countrySlug}
                    subdivision={query.subdivision}
                    destinations={locationDetails.sublocations}
                  />
                )}
              {locationDetails && locationDetails.budget_score && (
                <Tooltip
                  title={getBudgetScore(locationDetails.budget_score, title)}
                >
                  <Typography
                    component="p"
                    variant="h4"
                    className="pt-2 text-light font-weight-bold"
                  >
                    {'$'.repeat(locationDetails.budget_score)}
                  </Typography>
                </Tooltip>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className="text-mutedlight text-right pr-1"
        style={{ fontSize: '0.8rem' }}
      >
        {locationDetails && locationDetails.url && (
          <span>
            Description by{' '}
            <a
              className="text-mutedlight text-decoration-underline"
              target="_blank"
              rel="nofollow noreferrer noopener"
              href={locationDetails && locationDetails.url}
            >
              Wikipedia
            </a>{' '}
            under{' '}
            <a
              className="text-mutedlight text-decoration-underline"
              target="_blank"
              rel="nofollow noreferrer noopener"
              href={locationDetails && locationDetails.license}
            >
              CC BY-SA 3.0
            </a>
            .{' '}
          </span>
        )}
        {locationDetails && locationDetails.attribution && (
          <span>
            Photo:{' '}
            {(locationDetails && locationDetails.unsplashUser && (
              <a
                className="text-mutedlight text-decoration-underline"
                target="_blank"
                rel="nofollow noreferrer noopener"
                href={`https://unsplash.com/@${locationDetails &&
                  locationDetails.unsplashUser}?utm_source=TravelFeed&utm_medium=referral`}
              >
                {locationDetails && locationDetails.attribution}
              </a>
            )) || (
              <span className="text-mutedlight">
                {locationDetails && locationDetails.attribution}
              </span>
            )}{' '}
            {locationDetails && locationDetails.unsplashUser && (
              <span>
                /{' '}
                <a
                  target="_blank"
                  rel="nofollow noreferrer noopener"
                  href="https://unsplash.com/?utm_source=TravelFeed&utm_medium=referral"
                  className="text-mutedlight text-decoration-underline"
                >
                  Unsplash
                </a>
              </span>
            )}
          </span>
        )}
      </div>
    </>
  );
  const loadedCard = (
    <div
      className="w-100"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3),rgba(0, 0, 0,0.5)),
url("${image}")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover',
      }}
    >
      {innerCard}
    </div>
  );

  return (
    <>
      {locationDetails && locationDetails && !locationDetails.image ? (
        loadedCard
      ) : (
        <ProgressiveImage src={image} placeholder="">
          {(src, imgloading) => {
            if (imgloading) {
              return (
                <>
                  <div
                    className="MuiSkeleton-rect w-100 MuiSkeleton-animate"
                    style={{
                      minHeight: '400px',
                      backgroundColor: 'rgba(0, 0, 0, 0.08)',
                    }}
                  >
                    {innerCard}
                  </div>
                </>
              );
            }
            return loadedCard;
          }}
        </ProgressiveImage>
      )}
      {locationDetails && locationDetails.topics && (
        <TopicSelector
          topics={locationDetails.topics}
          active={props.topic}
          onChange={props.setTopic}
        />
      )}
    </>
  );
};

export default PhotoHeader;
