import IconButton from '@material-ui/core/IconButton';
import FlightIcon from '@material-ui/icons/FlightTakeoff';
import React from 'react';
import { vote } from '../../helpers/actions';
import { VOTE } from '../../helpers/graphql/broadcast';
import graphQLClient from '../../helpers/graphQLClient';
import { getRoles } from '../../helpers/token';

const VoteButton = props => {
  const { author, permlink, pastVote, setLoading } = props;
  const weight = props.weight * 1000;

  const votePost = () => {
    setLoading();
    const roles = getRoles();
    if (roles && roles.indexOf('easylogin') !== -1) {
      const variables = {
        author,
        permlink,
        weight,
      };
      graphQLClient(VOTE, variables).then(res => {
        if (res && res.vote) pastVote(res.vote);
        setLoading(false);
      });
    } else {
      vote(author, permlink, weight).then(res => {
        if (res) {
          pastVote(res);
        }
      });
    }
  };

  return (
    <IconButton aria-label="Upvote" onClick={() => votePost()} color="primary">
      <FlightIcon className="mr" />
    </IconButton>
  );
};

export default VoteButton;
