import React, { useEffect, useState } from 'react';
import Curation from '../../components/Dashboard/Curation';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import { getRoles } from '../../helpers/token';
import withApollo from '../../lib/withApollo';

const CurationPage = () => {
  const [roles, setRoles] = useState(undefined);

  useEffect(() => {
    setRoles(getRoles());
  }, []);

  const isCurator = roles && roles.indexOf('curator') !== -1;

  return (
    <DashboardPage
      label="curation"
      content={isCurator ? <Curation /> : <></>}
    />
  );
};

export default withApollo(CurationPage);
