import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import Onboarding from '../../components/Dashboard/Onboarding';
import { getRoles } from '../../helpers/token';

const OnboardingPage = props => {
  const { open } = props;
  const [roles, setRoles] = useState(undefined);

  useEffect(() => {
    setRoles(getRoles());
  }, []);

  const isCurator = roles && roles.indexOf('curator') !== -1;

  return (
    <DashboardPage
      open={open}
      label="onboarding"
      content={isCurator ? <Onboarding /> : <></>}
    />
  );
};

OnboardingPage.getInitialProps = props => {
  const { open } = props.query;
  return { open };
};

OnboardingPage.propTypes = {
  open: PropTypes.string,
};

export default OnboardingPage;
