import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import { nameFromSlug } from '../../helpers/countryCodes';
import { GET_LOCATION_DETAILS } from '../../helpers/graphql/locations';
import Link from '../../lib/Link';
import EditLocationDetails from './EditLocationDetails';

const PhotoDetailHeader = props => {
  const { query, countrySlug, title, tag } = props;

  return (
    <Fragment>
      <Query query={GET_LOCATION_DETAILS} variables={query}>
        {({ data, loading }) => {
          if (loading || (data && data.locationDetails)) {
            return (
              <Fragment>
                <div
                  className="w-100"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3),rgba(0, 0, 0,0.5)),
                      url("${(data && data.locationDetails.image) || ''}")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover',
                  }}
                >
                  <div className="container h-100">
                    <div className="row h-100" style={{ minHeight: '500px' }}>
                      <div className="col-12 my-auto">
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
                          (tag && `#${tag}`) ||
                            (query.city && (
                              <span>
                                <Link
                                  color="textPrimary"
                                  as={`/destinations/${countrySlug}/`}
                                  href={`/destinations?country=${countrySlug}`}
                                >
                                  <span className="text-light font-weight-bold">
                                    {nameFromSlug(countrySlug)}
                                  </span>
                                </Link>
                                <span className="text-light">
                                  {' '}
                                  &raquo;{' '}
                                  <Link
                                    color="textPrimary"
                                    as={`/destinations/${countrySlug}/${query.subdivision}`}
                                    href={`/destinations?country=${countrySlug}&subdivision=${query.subdivision}`}
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
                                href={`/destinations?country=${countrySlug}`}
                              >
                                <span className="text-light font-weight-bold">
                                  {(data && data.locationDetails.subtitle) ||
                                    nameFromSlug(countrySlug)}
                                </span>
                              </Link>
                            ))}
                          <EditLocationDetails
                            country_code={props.query.country_code}
                            subdivision={props.query.subdivision}
                            city={props.query.city}
                            tag={tag}
                            data={
                              data && data.locationDetails
                                ? data.locationDetails
                                : {}
                            }
                          />
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
                          {(data &&
                            data.locationDetails &&
                            data.locationDetails.title) ||
                            title}
                        </Typography>
                        <p
                          className="lead text-light text-center"
                          style={{
                            textShadow: '1px 1px 10px black',
                          }}
                        >
                          <em>
                            {(data && data.locationDetails.description) || (
                              <>
                                <br />
                                <br />
                              </>
                            )}
                          </em>
                        </p>
                        {data &&
                          data.locationDetails.sublocations &&
                          data &&
                          data.locationDetails.sublocations.length > 1 && (
                            <div className="row p-2 justify-content-md-center">
                              <div className="col-12">
                                <Typography
                                  variant="h4"
                                  className="text-light font-weight-bold"
                                  style={{
                                    textShadow: '1px 1px 10px #343A40',
                                  }}
                                  align="center"
                                  component="h3"
                                  gutterBottom
                                >
                                  Popular destinations
                                </Typography>
                              </div>
                              {data &&
                                data.locationDetails.sublocations.map(
                                  (location, index) => {
                                    //   limit results
                                    if (index > 11) {
                                      return <Fragment />;
                                    }
                                    return (
                                      <div
                                        key={`${countrySlug}_${
                                          location.subdivision
                                            ? location.subdivision
                                            : `${query.subdivision}_${location.city}`
                                        }`}
                                        className="col-xl-2 col-lg-2 col-md-3 col-sm-4 col-xs-6 text-center"
                                      >
                                        <Link
                                          color="textPrimary"
                                          href={`/destinations?country=${countrySlug}&subdivision=${
                                            location.subdivision
                                              ? location.subdivision
                                              : `${query.subdivision}&city=${location.city}`
                                          }`}
                                          as={`/destinations/${countrySlug}/${
                                            location.subdivision
                                              ? location.subdivision
                                              : `${query.subdivision}/${location.city}`
                                          }`}
                                        >
                                          <span
                                            className="text-light"
                                            style={{
                                              textShadow: '1px 1px 10px black',
                                            }}
                                          >
                                            {location.city
                                              ? location.city
                                              : location.subdivision}
                                          </span>
                                        </Link>
                                      </div>
                                    );
                                  },
                                )}
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                  <div
                    className="text-mutedlight text-right pr-1"
                    style={{ fontSize: '0.8rem' }}
                  >
                    {data && data.locationDetails.url && (
                      <span>
                        Description by{' '}
                        <a
                          className="text-mutedlight text-decoration-underline"
                          target="_blank"
                          rel="nofollow noreferrer noopener"
                          href={data && data.locationDetails.url}
                        >
                          Wikipedia
                        </a>{' '}
                        under{' '}
                        <a
                          className="text-mutedlight text-decoration-underline"
                          target="_blank"
                          rel="nofollow noreferrer noopener"
                          href={data && data.locationDetails.license}
                        >
                          CC BY-SA 3.0
                        </a>
                        .{' '}
                      </span>
                    )}
                    {data && data.locationDetails.attribution && (
                      <span>
                        Photo:{' '}
                        {(data && data.locationDetails.unsplashUser && (
                          <a
                            className="text-mutedlight text-decoration-underline"
                            target="_blank"
                            rel="nofollow noreferrer noopener"
                            href={`https://unsplash.com/@${data &&
                              data.locationDetails
                                .unsplashUser}?utm_source=TravelFeed&utm_medium=referral`}
                          >
                            {data && data.locationDetails.attribution}
                          </a>
                        )) || (
                          <span className="text-mutedlight">
                            {data && data.locationDetails.attribution}
                          </span>
                        )}{' '}
                        {data && data.locationDetails.unsplashUser && (
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
                </div>
              </Fragment>
            );
          }
          return <Fragment />;
        }}
      </Query>
    </Fragment>
  );
};

PhotoDetailHeader.propTypes = {
  query: PropTypes.objectOf(PropTypes.string).isRequired,
  countrySlug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default PhotoDetailHeader;
