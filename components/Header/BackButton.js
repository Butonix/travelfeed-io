import BackIcon from '@material-ui/icons/ArrowBackIos';
import Router from 'next/router';
import React from 'react';

const BackButton = () => {
  return <BackIcon onClick={() => Router.back()} className="text-light" />;
};

export default BackButton;
