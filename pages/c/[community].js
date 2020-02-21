import React from 'react';
import Community from '../../components/Community/Community';
import ErrorPage from '../../components/General/ErrorPage';
import Header from '../../components/Header/Header';
import { callBridge } from '../../helpers/steem';
import withApollo from '../../lib/withApollo';

const CommunityPage = props => {
  const { id } = props;
  if (!id)
    return (
      <>
        <Header />
        <ErrorPage statusCode={404} />
      </>
    );

  return (
    <>
      <Community community={props} />
    </>
  );
};

CommunityPage.getInitialProps = async props => {
  const { community } = props.query;

  try {
    const getCommunity = await callBridge('get_community', {
      name: `hive-${community}`,
      observer: 'jpphotography',
    });
    return getCommunity;
  } catch {
    return {};
  }
};

export default withApollo(CommunityPage);
