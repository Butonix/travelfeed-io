import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import { withSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { SET_CURATION_SCORE } from '../../../helpers/graphql/curation';
import graphQLClient from '../../../helpers/graphQLClient';
import EmojiSlider from '../../Post/EmojiSlider';

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
    handleNext,
    handleSetPostWeight,
    isTf,
    author,
    permlink,
    state,
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

  const triggerCurate = () => {
    let score = weight * 5;
    if (isTf) score = weight * 10;
    score = Math.round(score);
    graphQLClient(SET_CURATION_SCORE, {
      author,
      permlink,
      score,
      formatting,
      language,
      bilingual,
      footer,
      photos,
      short,
      writing,
      valueadding,
    }).then(({ setCurationScore }) => {
      if (!setCurationScore.success) newNotification(setCurationScore);
    });
    handleNext();
    handleSetPostWeight(weight);
    setLoading(undefined);
  };

  const handleWeightChange = (event, value) => {
    setWeight(value);
    setLoading(true);
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
                onChangeCommitted={triggerCurate}
              />
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default withSnackbar(StickyCurationSlider);
