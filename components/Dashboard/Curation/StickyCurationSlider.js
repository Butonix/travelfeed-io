import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { SET_CURATION_SCORE } from '../../../helpers/graphql/curation';
import graphQLClient from '../../../helpers/graphQLClient';
import { swmregex } from '../../../helpers/regex';
import EmojiSlider from '../../Post/EmojiSlider';
import BlacklistMenu from './BlacklistMenu';

const useStyles = makeStyles(() => ({
  fixed: {
    borderRadius: 0,
    height: '50px',
  },
  voteBar: {
    position: 'fixed',
    bottom: 0,
    right: 0,
    width: '100%',
    zIndex: '900',
    height: '50px',
  },
}));

const StickyCurationSlider = props => {
  const {
    body,
    handleNext,
    handleSetPostWeight,
    // isTf,
    author,
    permlink,
    state,
    title,
    location,
  } = props;
  const {
    formatting,
    language,
    bilingual,
    footer,
    photos,
    short,
    writing,
    valueadding,
  } = state;
  const [weight, setWeight] = useState(props.weight || 0);
  const [loading, setLoading] = useState(undefined);
  const [blacklistOpen, setBlacklistOpen] = useState(false);

  const classes = useStyles();

  const newNotification = notification => {
    if (notification !== undefined) {
      let variant = 'success';
      if (notification.success === false) {
        variant = 'error';
      }
      props.enqueueSnackbar(notification.message, { variant });
    }
  };

  useEffect(() => {
    setWeight(props.weight || 0);
  }, [props]);

  const triggerCurate = negativeScore => {
    if (!negativeScore && weight < 0) return;
    let score = weight * 10;
    // let score = weight * 5;
    // if (isTf) score = weight * 10;
    if (negativeScore) score = -100;
    score = Math.round(score);
    const swmmatch = body.match(swmregex);
    const swm = swmmatch ? swmmatch.length > 1 : false;
    console.log(swm);
    graphQLClient(SET_CURATION_SCORE, {
      author,
      permlink,
      title,
      score,
      formatting,
      swm,
      language,
      bilingual,
      footer,
      photos,
      short,
      writing,
      valueadding,
      location,
    }).then(({ setCurationScore }) => {
      if (!setCurationScore.success) newNotification(setCurationScore);
    });
    handleNext();
    handleSetPostWeight(weight);
    setLoading(undefined);
  };

  const handleSliderDrop = () => {
    if (weight > -1 && weight < 0) {
      setWeight(0);
      setLoading(undefined);
    }
    triggerCurate(false);
  };

  const handleWeightChange = (event, value) => {
    setWeight(value);
    if (weight < -1) setBlacklistOpen(true);
    if (weight < -1 || weight > 0) {
      setLoading(true);
    }
  };

  const handleBlacklistConfirm = () => {
    setWeight(0);
    setBlacklistOpen(false);
    triggerCurate(true);
  };

  const handleBlacklistCancel = () => {
    setWeight(0);
    setBlacklistOpen(false);
    setLoading(undefined);
  };

  return (
    <>
      <div className={classes.voteBar}>
        <Card className={`container-fluid ${classes.fixed}`}>
          <div className="row h-100">
            <div className="col-12 my-auto">
              <EmojiSlider
                hideValueLabel
                loading={loading}
                weight={weight}
                setWeight={handleWeightChange}
                onChangeCommitted={handleSliderDrop}
              />
            </div>
          </div>
        </Card>
      </div>
      <BlacklistMenu
        open={blacklistOpen}
        onConfirm={handleBlacklistConfirm}
        onCancel={handleBlacklistCancel}
        author={author}
        permlink={permlink}
      />
    </>
  );
};

export default withSnackbar(StickyCurationSlider);
