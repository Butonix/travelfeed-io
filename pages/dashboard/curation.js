import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import Curation from '../../components/Dashboard/Curation';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import { getRoles } from '../../helpers/token';

const CurationPage = props => {
  const { open } = props;
  const [roles, setRoles] = useState(undefined);

  useEffect(() => {
    setRoles(getRoles());
  }, []);

  const isCurator = roles && roles.indexOf('curator') !== -1;

  return (
    <DashboardPage
      open={open}
      label="curation"
      content={isCurator ? <Curation /> : <></>}
    />
  );
};

CurationPage.getInitialProps = props => {
  const { open } = props.query;
  return { open };
};

CurationPage.propTypes = {
  open: PropTypes.string,
};

export default CurationPage;
