import React, { useEffect, useState } from 'react';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import Reports from '../../components/Dashboard/Reports';
import { getRoles } from '../../helpers/token';
import withApollo from '../../lib/withApollo';

const ReportsPage = () => {
  const [roles, setRoles] = useState(undefined);

  useEffect(() => {
    setRoles(getRoles());
  }, []);

  const isCurator = roles && roles.indexOf('curator') !== -1;

  return (
    <DashboardPage label="reports" content={isCurator ? <Reports /> : <></>} />
  );
};

export default withApollo(ReportsPage);
