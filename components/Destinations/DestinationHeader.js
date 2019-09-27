import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import { nameFromSlug } from '../../helpers/countryCodes';
import { GET_LOCATION_DETAILS } from '../../helpers/graphql/locations';
import Link from '../../lib/Link';

const DestinationHeader = props => {
  const { query, countrySlug, title } = props;

  return (
    <Fragment>
      <Query query={GET_LOCATION_DETAILS} variables={query}>
        {({ data, loading }) => {
          if (loading || (data && data && data.locationDetails)) {
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
                        <h5
                          className="text-center pt-3"
                          style={{
                            textShadow: '1px 1px 10px #343A40',
                          }}
                        >
                          {// For cities, display breadcrumbs to Country and Subdivison. Else, display Knowledge Graph subtitle, if unavailable country name
                          (query.city && (
                            <span>
                              <Link
                                color="textPrimary"
                                as={`/destinations/${countrySlug}/`}
                                href={`/destinations?country=${countrySlug}`}
                                passHref
                              >
                                <a className="text-light font-weight-bold">
                                  {nameFromSlug(countrySlug)}
                                </a>
                              </Link>
                              <span className="text-light">
                                {' '}
                                &raquo;{' '}
                                <Link
                                  color="textPrimary"
                                  as={`/destinations/${countrySlug}/${query.subdivision}`}
                                  href={`/destinations?country=${countrySlug}&subdivision=${query.subdivision}`}
                                  passHref
                                >
                                  <a className="text-light font-weight-bold">
                                    {query.subdivision}
                                  </a>
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
                                passHref
                              >
                                <a className="text-light font-weight-bold">
                                  {(data && data.locationDetails.subtitle) ||
                                    nameFromSlug(countrySlug)}
                                </a>
                              </Link>
                            ))}
                        </h5>
                        <Typography
                          gutterBottom
                          variant="h2"
                          className="text-light font-weight-bold text-center"
                          style={{
                            textShadow: '1px 1px 10px #343A40',
                          }}
                        >
                          {title}
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
                                <h4
                                  className="text-center text-light"
                                  style={{
                                    textShadow: '1px 1px 10px #343A40',
                                  }}
                                >
                                  Popular destinations:
                                </h4>
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
                                          passHref
                                        >
                                          <a
                                            className="text-light"
                                            style={{
                                              textShadow: '1px 1px 10px black',
                                            }}
                                          >
                                            {location.city
                                              ? location.city
                                              : location.subdivision}
                                          </a>
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
                          <Link
                            color="textPrimary"
                            as={`/@${data && data.locationDetails.attribution}`}
                            href={`/blog?author=${data &&
                              data.locationDetails.attribution}`}
                            passHref
                          >
                            <a className="text-mutedlight text-decoration-underline">
                              @{data && data.locationDetails.attribution}
                            </a>
                          </Link>
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

DestinationHeader.propTypes = {
  query: PropTypes.objectOf(PropTypes.string).isRequired,
  countrySlug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default DestinationHeader;
