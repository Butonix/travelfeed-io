import Typography from '@material-ui/core/Typography';
import React from 'react';
import CustomJson from '../../CuratorMenu/Actions/CustomJson';

const FinalCuration = props => {
  const { curationScores } = props;

  return (
    <>
      <ul>
        {curationScores &&
          curationScores.map(cs => {
            return (
              <Typography component="li" variant="body1">
                <em>{cs.score}</em>{' '}
                <a
                  href={`/@${cs.author}/${cs.permlink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {cs.title}
                </a>{' '}
                <em>
                  by{' '}
                  <a
                    href={`/@${cs.author}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @{cs.author}
                  </a>
                </em>
                {' - '}
                <CustomJson
                  isLink
                  author={cs.author}
                  permlink={cs.permlink}
                  action="curate"
                  title={`Are you sure that you want to curate "${cs.title}" by @${cs.author}?`}
                  desc="This post will be upvoted with 100% by @travelfeed and it's curation trail, resteemed and will receive a congratulation comment."
                />
                {' - '}
                <CustomJson
                  isLink
                  author={cs.author}
                  permlink={cs.permlink}
                  action="honour"
                  title={`Are you sure that you want to honour "${cs.title}" by @${cs.author}?`}
                  desc="This post will be upvoted with 50% by @travelfeed and will receive a congratulation comment."
                />
              </Typography>
            );
          })}
      </ul>
    </>
  );
};

export default FinalCuration;
