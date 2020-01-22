import Skeleton from '@material-ui/lab/Skeleton';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import React from 'react';
import Img from 'react-image';
import { imageProxy } from '../../helpers/getImage';

const styles = theme => ({
  imgborder: {
    border: `4px solid ${theme.palette.background.default}`,
  },
});

const AuthorProfileImage = props => {
  const { classes } = props;

  const img = props.image
    ? imageProxy(props.image, 300, 300)
    : `https://steemitimages.com/u/${
        props.user ? props.user : 'null'
      }/avatar/large`;

  return (
    <Img
      src={[
        img,
        `https://steemitimages.com/p/7ohP4GDMGPrVF5MeU8t5EQqCvJfGAJHyAFuxrYFhqA4BPKCkPjVBef1jSt7fHRrXVXRuRKBksi1FSJnZL8Co9zi6CpbK1bmV2sFR?width=512&height=512`,
      ]}
      alt="avatar"
      width="200"
      height="200"
      className={`rounded-circle p-0 ${classes.imgborder}`}
      loader={
        <Skeleton
          className={`mx-auto p-0 ${classes.imgborder}`}
          variant="circle"
          width={200}
          height={200}
        />
      }
    />
  );
};

AuthorProfileImage.propTypes = {
  classes: PropTypes.objectOf(PropTypes.string).isRequired,
  user: PropTypes.string,
};

export default withStyles(styles, { withTheme: true })(AuthorProfileImage);
