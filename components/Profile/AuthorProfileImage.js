import '@fortawesome/fontawesome-svg-core/styles.css';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { imageProxy } from '../../helpers/getImage';

const styles = theme => ({
  imgborder: {
    border: `4px solid ${theme.palette.background.default}`,
  },
});

const AuthorProfileImage = props => {
  const { classes } = props;

  const dataSrc = props.image
    ? imageProxy(props.image, 300, 300)
    : `https://steemitimages.com/u/${
        props.user ? props.user : 'null'
      }/avatar/large`;

  const src = props.image
    ? imageProxy(props.image, 10, 10)
    : `https://steemitimages.com/u/${
        props.user ? props.user : 'null'
      }/avatar/small`;

  return (
    <img
      src={src}
      data-src={dataSrc}
      alt="avatar"
      width="200"
      height="200"
      className={`lazy rounded-circle p-0 ${classes.imgborder}`}
    />
  );
};

AuthorProfileImage.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  user: PropTypes.string,
};

export default withStyles(styles, { withTheme: true })(AuthorProfileImage);
