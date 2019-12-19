import PropTypes from 'prop-types';
import React from 'react';
import Curation from '../../components/Dashboard/Curation';
import DashboardPage from '../../components/Dashboard/DashboardPage';

const CurationPage = props => {
  const { open } = props;

  return <DashboardPage open={open} label="curation" content={<Curation />} />;
};

CurationPage.getInitialProps = props => {
  const { open } = props.query;
  return { open };
};

CurationPage.propTypes = {
  open: PropTypes.string,
};

export default CurationPage;
