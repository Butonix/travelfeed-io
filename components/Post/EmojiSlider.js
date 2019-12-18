import CircularProgress from '@material-ui/core/CircularProgress';
import { red, teal } from '@material-ui/core/colors';
import Slider from '@material-ui/core/Slider';
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles,
} from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import VoteButton from './VoteButton';

const downVoteTheme = createMuiTheme({
  palette: {
    primary: red,
  },
});

const upVoteTheme = createMuiTheme({
  palette: {
    primary: teal,
  },
});

const StyledSlider = withStyles({
  thumb: {
    height: 29,
    width: 29,
    backgroundColor: '#fff',
    border: '1px solid currentColor',
    marginTop: -12,
    marginLeft: -12,
  },
})(Slider);

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
};

class EmojiSlider extends Component {
  EmojiThumbComponent = props => {
    return (
      <span {...props}>
        {(this.props.loading !== undefined && (
          <CircularProgress
            value={this.props.loading}
            size={19}
            thickness={4}
          />
        )) || <VoteButton weight={this.props.weight} size="35" />}
      </span>
    );
  };

  render() {
    const { weight, setWeight, onChangeCommitted } = this.props;

    return (
      <>
        <MuiThemeProvider theme={weight < 0 ? downVoteTheme : upVoteTheme}>
          <StyledSlider
            ValueLabelComponent={
              this.props.hideValueLabel ? undefined : ValueLabelComponent
            }
            ThumbComponent={this.EmojiThumbComponent}
            track={false}
            valueLabelFormat={x => {
              let number = x;
              if (number > -0.5 && number < 0) number = -1;
              else if (number >= 0 && number < 0.5) number = 1;
              number = Math.round(number);
              return x >= 0 ? `+${number}` : number;
            }}
            value={weight}
            min={-10}
            max={10}
            step={0.001}
            onChange={setWeight}
            onChangeCommitted={onChangeCommitted}
          />
        </MuiThemeProvider>
      </>
    );
  }
}

export default EmojiSlider;
