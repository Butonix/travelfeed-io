import { useQuery } from '@apollo/react-hooks';
import React from 'react';
import { GET_POST_CURATION_SCORE } from '../../helpers/graphql/curationScores';
import PostScoreIndicator from './PostScoreIndicator';

const PostScore = props => {
  const { data } = useQuery(GET_POST_CURATION_SCORE, {
    variables: props,
  });

  if (!data || data.postCurationScores.formatting === null) return <></>;

  return <PostScoreIndicator scores={data.postCurationScores} />;
};
export default PostScore;
