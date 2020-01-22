import React, { useEffect, useState } from 'react';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import Newsletter from '../../components/Dashboard/Newsletter';
import { getRoles } from '../../helpers/token';
import withApollo from '../../lib/withApollo';

const NewsletterPage = () => {
  const [roles, setRoles] = useState(undefined);

  useEffect(() => {
    setRoles(getRoles());
  }, []);

  const isCurator = roles && roles.indexOf('curator') !== -1;

  return (
    <DashboardPage
      label="newsletter"
      content={isCurator ? <Newsletter /> : <></>}
    />
  );
};

export default withApollo(NewsletterPage);
