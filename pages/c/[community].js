import React from 'react';
import Community from '../../components/Community/Community';
import ErrorPage from '../../components/General/ErrorPage';
import Header from '../../components/Header/Header';
import { communityList } from '../../helpers/communities';
import { callBridge } from '../../helpers/steem';
import withApollo from '../../lib/withApollo';

const CommunityPage = props => {
  const { id, name } = props;
  if (!id)
    return (
      <>
        <Header />
        <ErrorPage statusCode={404} />
      </>
    );
  if (communityList.indexOf(name) === -1)
    return (
      <>
        <Header />
        <ErrorPage statusCode="communityNotWhitelisted" />
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
