import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
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

const StickyCurationSlider = () => {
  const [weight, setWeight] = useState(0);
  const [loading, setLoading] = useState(undefined);

  const classes = useStyles();

  const triggerCurate = () => {
    console.log('Curate this');
    // TODO: Implement curation action
    setLoading(false);
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

export default StickyCurationSlider;
