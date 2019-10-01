import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import React from 'react';
import DashboardPage from '../../components/Dashboard/DashboardPage';

const PublishPage = props => {
  const { open, edit } = props;

  const Publish = dynamic(() => import('../../components/Dashboard/Publish'), {
    ssr: false,
  });

  return (
    <DashboardPage
      open={open}
      label="publish"
      content={<Publish edit={edit} />}
    />
  );
};

PublishPage.getInitialProps = props => {
  const {
    id,
    permlink,
    savedate,
    title,
    body,
    jsonMeta,
    json,
    open,
    editmode,
    isCodeEditor,
  } = props.query;
  return {
    edit: {
      id,
      permlink,
      savedate,
      title,
      body,
      jsonMeta,
      json,
      editmode,
      isCodeEditor,
    },
    open,
  };
};

PublishPage.propTypes = {
  open: PropTypes.string,
  edit: PropTypes.object,
};

export default PublishPage;
