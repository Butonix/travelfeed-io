import Typography from '@material-ui/core/Typography';
import React, { Component, Fragment } from 'react';
import { GET_GEOIP } from '../../helpers/graphql/geoIp';
import { CHANGE_SETTINGS } from '../../helpers/graphql/settings';
import graphQLClient from '../../helpers/graphQLClient';
import {
  getCountryCode,
  getUser,
  hasCookieConsent,
  setCookieConsent,
  setCountryCode,
} from '../../helpers/token';
import Link from '../../lib/Link';
import CookiePopup from './CookiePopup';

class CookieConsent extends Component {
  state = {
    open: false,
  };

  componentDidMount() {
    const hasConsent = hasCookieConsent() === 'true';
    const hasCountry = getCountryCode() !== undefined;
    if (!hasConsent || !hasCountry) {
      graphQLClient(GET_GEOIP).then(({ geoIp }) => {
        const { hasAcceptedCookies, countryCode, isEu } = geoIp;
        if (hasAcceptedCookies || !isEu) this.accept();
        else this.setState({ open: !hasConsent });
        setCountryCode(countryCode);
      });
    } else this.setState({ open: !hasConsent });
  }

  accept = () => {
    setCookieConsent('true');
    this.setState({ open: false });
    if (getUser()) graphQLClient(CHANGE_SETTINGS, { hasAcceptedCookies: true });
  };

  decline = () => {
    this.setState({ open: false });
  };

  render() {
    const { open } = this.state;
    if (open === false) return <Fragment />;
    return (
      <CookiePopup
        open={open}
        accept={this.accept}
        decline={this.decline}
        allowtext="Allow cookies"
        // Set containerid only for this consent since some browser
        // plugins block this
        containerid="cookieconsent"
        content={
          <Typography variant="body1" className="text-light">
            We use cookies to improve your experience and to analyze how our
            site is used.
            <br />
            <Link color="textPrimary" href="/about/cookies">
              <a className="text-light text-decoration-underline">Learn more</a>
            </Link>
          </Typography>
        }
      />
    );
  }
}

export default CookieConsent;
