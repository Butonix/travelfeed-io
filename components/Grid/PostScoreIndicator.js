import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import React, { useState } from 'react';
import calculateQualityScore from '../../helpers/calculateQualityScore';
import VoteButton from '../Post/VoteButton';

const PostScoreIndicator = props => {
  const { scores } = props;

  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip
        title="Click to view the detailed curator evaluation"
        placement="bottom-start"
      >
        <IconButton size="small" color="primary" onClick={() => setOpen(true)}>
          <VoteButton weight={calculateQualityScore([scores])} size="24" />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Curator evaluation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {!scores || Object.values(scores).indexOf(true) === -1 ? (
              'We love your blog! Keep up the great work :)'
            ) : (
              <ul>
                {scores.notTf ? (
                  <li>
                    We noticed that you did not publish your post through
                    TravelFeed.io or edited your post on other Steem frontends.
                    For better-looking blogs, we recommend you use our
                    EasyEditor. As a bonus, when you post through our platform,
                    you receive double upvotes from us, you are eligible for the
                    top pick of the day (resteem + featured on the TravelFeed.io
                    front page) and you can earn extra rewards from being
                    featured in our daily curation posts. You can simply login
                    with your existing Steem account using Steemconnect or Steem
                    Keychain. See you next time on TravelFeed.io !
                  </li>
                ) : (
                  <></>
                )}
                {scores.formatting ? (
                  <li>
                    We recommend you improve the formatting of your post (e.g.
                    subheadings, font size, structure, better photo placements,
                    etc.). You can check out the several formatting options in
                    the TravelFeed.io EasyEditor.
                  </li>
                ) : (
                  <></>
                )}
                {scores.bilingual ? (
                  <li>
                    We recommend to focus on only one language per post for an
                    easier reading experience. You can choose the language of
                    your post in the TravelFeed.io editor below the topics
                    selection.
                  </li>
                ) : (
                  <></>
                )}
                {scores.photos ? (
                  <li>
                    Great story, however, we would love to see more good quality
                    photos in your blog. You do not need a high end camera for
                    this, you can check out free apps to edit and improve the
                    quality of your photos.
                  </li>
                ) : (
                  <></>
                )}
                {scores.writing ? (
                  <li>
                    We love hearing about your experience, but readers would
                    enjoy a more coherent story. In general, telling a story
                    instead of merely describing photos or a timeline of events
                    makes for a much better reading experience. We would love to
                    know more!
                  </li>
                ) : (
                  <></>
                )}
                {scores.language ? (
                  <li>
                    Great story! Before submitting your post, we recommend you
                    proof-read your blog or use free apps to check on spelling
                    and/ or grammar.
                  </li>
                ) : (
                  <></>
                )}
                {scores.footer ? (
                  <li>
                    We love your blog, however, your footer interrupts the
                    reading experience. You may look into shortening or
                    improving your footer when you post in TravelFeed.io.
                  </li>
                ) : (
                  <></>
                )}
                {scores.short ? (
                  <li>
                    You have reached our minimum 250 words requirement but we
                    encourage you to tell us more about your travel experience.
                  </li>
                ) : (
                  <></>
                )}
                {scores.valueadding ? (
                  <li>
                    We love hearing your personal experience but we encourage
                    you to add more informative details in your post that other
                    travelers are looking for.
                  </li>
                ) : (
                  <></>
                )}
                {scores.location ? (
                  <li>
                    Your post will be hard to find. With the location picker in
                    the TravelFeed.io editor you can easily add a location to
                    your post to improve its discoverability.
                  </li>
                ) : (
                  <></>
                )}
                {scores.swm ? (
                  <li>
                    We noticed that you manually added a Steemitworldmap snippet
                    to your post. When you pick a location on the TravelFeed
                    editor, we automatically add a hidden Steemitworldmap
                    snippet to your post, so no need to do that manually :)
                  </li>
                ) : (
                  <></>
                )}
              </ul>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PostScoreIndicator;
