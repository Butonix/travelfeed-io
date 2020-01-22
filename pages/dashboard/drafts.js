import React from 'react';
import DashboardPage from '../../components/Dashboard/DashboardPage';
import Drafts from '../../components/Dashboard/Drafts';

const DraftsPage = props => {
  return (
    <DashboardPage label="drafts" content={<Drafts sortby={props.sortby} />} />
  );
};

DraftsPage.getInitialProps = props => {
  const { sortby } = props.query;
  return { sortby };
};

export default DraftsPage;
