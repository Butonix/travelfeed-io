import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { imageProxy } from '../../helpers/getImage';
import supportsWebp from '../../helpers/webp';

class PostImageHeader extends Component {
  state = {
    windowWidth: 10,
    opacity: 0,
    webpSupport: undefined,
  };

  async componentDidMount() {
    const webpSupport = await supportsWebp();
    this.setState({
      windowWidth: (Math.ceil(window.innerWidth / 640) + 1) * 640,
      opacity: 1,
      webpSupport,
    });
  }

  render() {
    return (
      <div
        className="w-100"
        style={{
          height: this.props.bgheight,
          position: this.props.bgpos,
          marginTop: this.props.bgmargin,
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
