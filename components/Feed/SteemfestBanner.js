import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import React, { useEffect, useState } from 'react';
import { hasSteemFestCookie, removeSteemfestCookie } from '../../helpers/token';
import BangkokBanner from '../../images/bangkok-banner.jpg';
import Link from '../../lib/Link';

const SteemfestBanner = () => {
  const [isSteemfest, setIsSteemfest] = useState(false);

  useEffect(() => {
    setIsSteemfest(hasSteemFestCookie());
  }, []);

  const closeBanner = () => {
    setIsSteemfest(false);
    removeSteemfestCookie();
  };

  return (
    <>
      {isSteemfest && (
        <div className="d-block d-xl-none d-lg-none d-md-none d-sm-block">
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              padding: '2px',
            }}
          >
            <IconButton onClick={closeBanner} className="text-light">
              <CloseIcon />
            </IconButton>
          </div>
          <Link
            href="/destinations?country=thailand&subdivision=Bangkok"
            as="/destinations/thailand/Bangkok"
          >
            <img
              alt="Explore Bangkok"
              src={BangkokBanner}
              className="img-fluid"
            />
          </Link>
        </div>
      )}
    </>
  );
};

export default SteemfestBanner;
