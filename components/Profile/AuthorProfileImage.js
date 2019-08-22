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

const AuthorProfile = props => {
  const { classes } = props;

  const src = props.image
    ? imageProxy(props.image, 300, 300)
    : `https://steemitimages.com/u/${
        props.user ? props.user : 'null'
      }/avatar/large`;

  return (
    <img
      src={src}
      alt="avatar"
      width="200"
      height="200"
      className={`rounded-circle p-0 ${classes.imgborder}`}
    />
  );
};

AuthorProfile.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  user: PropTypes.string,
};

export default withStyles(styles, { withTheme: true })(AuthorProfile);
