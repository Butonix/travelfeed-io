import React from 'react';

const LightboxCaption = props => {
  const { currentView } = props;
  const { caption } = currentView;

  return <span>{caption}</span>;
};

export default LightboxCaption;
