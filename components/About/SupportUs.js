import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  getIsWitnessVote,
  getTfDelegation,
  getVesting,
} from '../../helpers/steem';
import { getUser } from '../../helpers/token';
import Link from '../../lib/Link';

const SupportUs = () => {
  const [delegationAmount, setDelegationAmount] = useState(1000);
  const [amountDelegated, setAmountDelegated] = useState(0);
  const [isWitnessVoted, setWitnessVoted] = useState(false);

  useEffect(() => {
    const user = getUser();
    if (user) {
      getVesting().then(vesting => {
        const { total_vesting_shares, total_vesting_fund_steem } = vesting;
        getTfDelegation(
          user,
          total_vesting_shares,
          total_vesting_fund_steem,
        ).then(res => {
          if (res.isDelegator) {
            setAmountDelegated(res.amountDelegated);
            setDelegationAmount(res.amountDelegated);
          }
        });
      });
      getIsWitnessVote(user).then(res => {
        setWitnessVoted(res);
      });
    }
  }, []);

  const handleDelegationChange = amount => {
    setDelegationAmount(amount.target.value);
  };

  const scWitnessVote = () => {
    window.open(
      'https://beta.steemconnect.com/sign/account-witness-vote?witness=travelfeed&redirect_uri=https%3A%2F%2Ftravelfeed.io%2Fwitnessvote%2Fsuccess',
      '_blank',
    );
  };

  const kcWitnessVote = () => {
    window.steem_keychain.requestWitnessVote(
      getUser(),
      'travelfeed',
      true,
      response => {
        if (response && response.success)
          Router.push({
            pathname: '/witnessvote/success',
          });
      },
    );
  };

  const voteWitness = () => {
    if (window && window.steem_keychain && getUser()) kcWitnessVote();
    else scWitnessVote();
  };

  const scDelegation = sp => {
    window.open(
      `https://app.steemconnect.com/sign/delegate_vesting_shares?delegatee=travelfeed&vesting_shares=${sp}.000%20SP&redirect_uri=https%3A%2F%2Ftravelfeed.io%2Fdelegation%2Fsuccess`,
      '_blank',
    );
  };

  const kcDelegation = sp => {
    window.steem_keychain.requestDelegation(
      getUser(),
      'travelfeed',
      `${sp}.000`,
      'SP',
      response => {
        if (response && response.success)
          Router.push({
            pathname: '/delegation/success',
          });
      },
    );
  };

  const delegateSp = sp => {
    if (window && window.steem_keychain && getUser()) kcDelegation(sp);
    else scDelegation(sp);
  };

  return (
    <>
      <Typography gutterBottom variant="h4" className="pt-2">
        Delegate to @travelfeed
      </Typography>
      {(amountDelegated > 0 && (
        <Typography gutterBottom variant="body1">
          You are currently delegating <strong>{amountDelegated} SP</strong>.
          This means that you are eligible for our airdrop to delegators when we
          launch our SMT, congratulations! Your delegation supports the manual
          curation of the best travel content on Steem. If you would like to
          increase your delegation, you can do so using the buttons below.
        </Typography>
      )) || (
        <Typography gutterBottom variant="body1">
          Delegations help us give higher rewards to content creators. Your
          delegation does not only supports the growth of this incredible
          project, but also helps the entire travel community on TravelFeed.io
          and the Steem blockchain. Once we launch our token, there will be a
          generous airdrop to delegators, so delegating now pays off! Use the
          buttons below to easily delegate via Steem Keychain or Steemconnect.
        </Typography>
      )}
      <div className="text-center pb-3">
        <Button
          className="m-1"
          onClick={() => delegateSp(100)}
          variant="contained"
          color="secondary"
        >
          100 SP
        </Button>
        <Button
          className="m-1"
          onClick={() => delegateSp(250)}
          variant="contained"
          color="secondary"
        >
          250 SP
        </Button>
        <Button
          className="m-1"
          onClick={() => delegateSp(500)}
          variant="contained"
          color="secondary"
        >
          500 SP
        </Button>
        <Button
          className="m-1"
          onClick={() => delegateSp(1000)}
          variant="contained"
          color="secondary"
        >
          1,000 SP
        </Button>
        <Button
          className="m-1"
          onClick={() => delegateSp(5000)}
          variant="contained"
          color="secondary"
        >
          5,000 SP
        </Button>
        <Button
          className="m-1"
          onClick={() => delegateSp(10000)}
          variant="contained"
          color="secondary"
        >
          10,000 SP
        </Button>
        <Button
          className="m-1"
          onClick={() => delegateSp(50000)}
          variant="contained"
          color="secondary"
        >
          50,000 SP
        </Button>
      </div>
      <div className="text-center pb-2">
        <Typography gutterBottom variant="h5" className="pt-2">
          Or delegate a custom amount:
        </Typography>
        <TextField
          style={{ marginLeft: '60px' }}
          type="number"
          value={delegationAmount}
          onChange={handleDelegationChange}
          label="SP to delegate"
          variant="outlined"
        />
        <Button
          style={{ left: '-60px' }}
          className="pt-2 pb-3 pt-3"
          onClick={() => delegateSp(delegationAmount)}
          variant="contained"
          color="secondary"
        >
          Delegate
        </Button>
      </div>
      <Divider />
      <Typography gutterBottom variant="h4" className="pt-4">
        {isWitnessVoted
          ? 'Thanks for voting for our Steem witness!'
          : 'Vote for our Steem Witness!'}
      </Typography>
      {isWitnessVoted ? (
        <Typography gutterBottom variant="body1">
          On behalf of the entire team and the TravelFeed community, we would
          like to thank you for your witness vote!
        </Typography>
      ) : (
        <>
          <Typography gutterBottom variant="body1">
            You can support TravelFeed by voting for our Steem witness
            @travelfeed. As a witness, we help to operate the decentralised
            Steem blockchain. By building a platform with huge potential and
            growth on Steem, we are supporting this amazing blockchain. In order
            to support other projects building on Steem, we are publishing large
            parts of our code base open source on{' '}
            <a
              target="_blank"
              rel="nofollow noreferrer noopener"
              href="https://github.com/travelfeed-io"
            >
              Github
            </a>
            .
          </Typography>
          <div className="text-center pb-3">
            <Button onClick={voteWitness} variant="contained" color="secondary">
              Vote for our witness
            </Button>
          </div>
        </>
      )}
      <Divider />
      <Typography gutterBottom variant="h4" className="pt-4">
        Support our Crowdfunding Campaign
      </Typography>
      <Typography gutterBottom variant="body1">
        As of now, all costs for running TravelFeed have been paid out of our
        own pockets, but taking TravelFeed to the next level requires some
        investment that we hope to (partly) cover by selling advertising space
        on TravelFeed through a crowdfunding campaign on Fundition. We really
        hope that you consider a contribution!
      </Typography>
      <div className="pb-3 text-center">
        <a
          className="p-1"
          href="https://fundition.io/#!/@travelfeed/81n9hwooj"
          target="_blank"
          rel="nofollow noreferrer noopener"
        >
          <Button variant="contained" color="secondary">
            Learn more
          </Button>
        </a>
      </div>
      <Divider />
      <Typography gutterBottom variant="h4" className="pt-4">
        Follow the TravelFeed Curation Trail
      </Typography>
      <Typography gutterBottom variant="body1">
        By following our curation trail, you automatically upvote all posts that
        we curate and help to reward quality content creators. We have made{' '}
        <Link
          color="textPrimary"
          as="/@travelfeed/tutorial-follow-the-travelfeed-curation-trail-on-steemauto"
          href="/[author]/[permlink]"
        >
          a simple tutorial
        </Link>{' '}
        explaining how to follow our curation trail.
      </Typography>
      <Divider />
      <Typography gutterBottom variant="h4" className="pt-4">
        Upvote our Daily Curation Posts
      </Typography>
      <Typography gutterBottom variant="body1">
        Upvoting our curation posts helps us to give higher rewards to the
        featured bloggers, who receive a share of the post rewards, and to pay
        our running costs. If you want to automatically upvote our posts, set up
        Steemauto as described in the tutorial above and add travelfeed to your
        fanbase.
      </Typography>
      <Divider />
      <Typography gutterBottom variant="h4" className="pt-4">
        Join the Team!
      </Typography>
      <Typography gutterBottom variant="body1">
        We are still looking for more curators to join our curation team! There
        is no direct financial reward and your TravelFeed posts would be
        excluded from curation while you are part of the curation team, but if
        you stick around for the long term, you will receive your part of the
        team share once we tokenize TravelFeed.
      </Typography>
      <Typography gutterBottom variant="body1">
        We are also looking for developers to help to improve TravelFeed. Please
        ping @jpphotography{' '}
        <a
          target="_blank"
          rel="nofollow noreferrer noopener"
          href="https://discord.gg/jWWu73H"
        >
          on our Discord server
        </a>{' '}
        if you are interested! TravelFeed is fully open-source, open issues are
        listed{' '}
        <a
          target="_blank"
          rel="nofollow noreferrer noopener"
          href="https://github.com/travelfeed-io/travelfeed-io/labels/help%20wanted"
        >
          on Github
        </a>
        .
      </Typography>
      <Divider />
      <Typography gutterBottom variant="h4" className="pt-4">
        Donate
      </Typography>
      <Typography gutterBottom variant="body1">
        We currently pay all server costs out of our own pockets. Donations to
        the Steem account @travelfeed, whether in Steem, SBD, Steem-Engine
        tokens or SBI shares, help us a lot.
      </Typography>
      <Divider />
      <Typography gutterBottom variant="h4" className="pt-4">
        Report Bugs
      </Typography>
      <Typography gutterBottom variant="body1">
        TravelFeed is still in Beta. If you encounter any bugs, please report
        them{' '}
        <a
          target="_blank"
          rel="nofollow noreferrer noopener"
          href="https://discord.gg/jWWu73H"
        >
          on our Discord server
        </a>{' '}
        in the channel #travelfeed. If you have a Github account, you can also{' '}
        <a
          target="_blank"
          rel="nofollow noreferrer noopener"
          href="https://github.com/travelfeed-io/travelfeed-io/issues/new"
        >
          submit an issue at our Github repository
        </a>
        .
      </Typography>
    </>
  );
};

export default SupportUs;
