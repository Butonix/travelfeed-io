import React, { useEffect, useState } from 'react';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import Onboarding from '../../components/Dashboard/Onboarding';
import { getRoles } from '../../helpers/token';
import withApollo from '../../lib/withApollo';

const OnboardingPage = () => {
  const [roles, setRoles] = useState(undefined);

  useEffect(() => {
    setRoles(getRoles());
  }, []);

  const isCurator = roles && roles.indexOf('curator') !== -1;

  return (
    <DashboardPage
      label="onboarding"
      content={isCurator ? <Onboarding /> : <></>}
    />
  );
};

export default withApollo(OnboardingPage);
