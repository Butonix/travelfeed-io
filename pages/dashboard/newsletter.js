import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import Newsletter from '../../components/Dashboard/Newsletter';
import { getRoles } from '../../helpers/token';

const NewsletterPage = props => {
  const { open } = props;
  const [roles, setRoles] = useState(undefined);

  useEffect(() => {
    setRoles(getRoles());
  }, []);

  const isCurator = roles && roles.indexOf('curator') !== -1;

  return (
    <DashboardPage
      open={open}
      label="newsletter"
      content={isCurator ? <Newsletter /> : <></>}
    />
  );
};

NewsletterPage.getInitialProps = props => {
  const { open } = props.query;
  return { open };
};

NewsletterPage.propTypes = {
  open: PropTypes.string,
};

export default NewsletterPage;
