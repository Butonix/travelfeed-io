import detectIt from 'detect-it';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { imageProxy } from '../../helpers/getImage';
import supportsWebp from '../../helpers/webp';

class PostImageHeader extends Component {
  state = {
    bgpos: 'fixed',
    bgheight: '100%',
    bgmargin: '0px',
    windowWidth: 10,
    opacity: 0,
    webpSupport: undefined,
  };

  async componentDidMount() {
    window.addEventListener(
      'scroll',
      this.listenScrollEvent,
      // better scroll performance: https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
      detectIt.passiveEvents ? { passive: true } : false,
    );
    const webpSupport = await supportsWebp();
    this.setState({
      windowWidth: (Math.ceil(window.innerWidth / 640) + 1) * 640,
      opacity: 1,
      webpSupport,
    });
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.listenScrollEvent);
  }

  listenScrollEvent = () => {
    if (window.scrollY > 500) {
      this.setState({
        bgpos: 'absolute',
        bgheight: window.innerHeight,
        bgmargin: '500px',
      });
    } else {
      this.setState({
        bgpos: 'fixed',
        bgheight: window.innerHeight,
        bgmargin: '0px',
      });
    }
  };

  render() {
    return (
      <div
        className="w-100"
        style={{
          height: this.state.bgheight,
          position: this.state.bgpos,
          marginTop: this.state.bgmargin,
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3),rgba(0, 0, 0,0.3)), url("${this.props.lazyImage}")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
        }}
      >
        <div
          className="w-100"
          style={{
            height: '100%',
            position: 'absolute',
            marginTop: '0px',
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3),rgba(0, 0, 0,0.3)), url("${imageProxy(
              this.props.backgroundImage,
              this.state.windowWidth,
              undefined,
              undefined,
              this.state.webpSupport ? 'webp' : undefined,
            )}")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            opacity: this.state.opacity,
            transition: 'opacity 2s linear',
          }}
        />
      </div>
    );
  }
}

PostImageHeader.propTypes = {
  backgroundImage: PropTypes.string.isRequired,
  lazyImage: PropTypes.string.isRequired,
};

export default PostImageHeader;
