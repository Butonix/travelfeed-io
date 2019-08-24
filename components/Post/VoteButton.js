import IconButton from '@material-ui/core/IconButton';
import FlightIcon from '@material-ui/icons/FlightTakeoff';
import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import { vote } from '../../helpers/actions';
import { VOTE } from '../../helpers/graphql/broadcast';
import { getRoles } from '../../helpers/token';

const VoteButton = props => {
  const [mutate, setMutate] = useState(false);

  const { author, permlink, pastVote, setLoading } = props;
  const weight = props.weight * 1000;

  const votePost = () => {
    setLoading();
    const roles = getRoles();
    if (roles && roles.indexOf('easylogin') !== -1) {
      setMutate(true);
    } else {
      vote(author, permlink, weight).then(res => {
        if (res) {
          pastVote(res);
        }
      });
    }
  };

  return (
    <>
      <Mutation
        mutation={VOTE}
        variables={{
          author,
          permlink,
          weight,
        }}
      >
        {(triggerVote, { data }) => {
          if (mutate) triggerVote();
          setMutate(false);
          if (data) {
            pastVote(data.vote);
          }
          return (
            <IconButton
              aria-label="Upvote"
              onClick={() => votePost()}
              color="primary"
            >
              <FlightIcon className="mr" />
            </IconButton>
          );
        }}
      </Mutation>
    </>
  );
};

export default VoteButton;
