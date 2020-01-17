import CardActionArea from '@material-ui/core/CardActionArea';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import PropTypes from 'prop-types';
// import Link from '../../lib/Link';
import React from 'react';
import { imageProxy } from '../../helpers/getImage';
import Link from '../../lib/Link';

const PostPreview = props => {
  const { isSmall } = props;
  const imgUrl = props.img_url ? imageProxy(props.img_url, 100, 100) : '';
  let titleUri = '';
  if (props.title) {
    try {
      titleUri = encodeURIComponent(props.title);
    } catch {
      console.log('Could not encode URI');
    }
  }
  return (
    <div key={props.author + props.permlink}>
      <Link
        color="textPrimary"
        as={`/@${props.author}/${props.permlink}`}
        href={`/post?author=${props.author}&permlink=${
          props.permlink
        }&depth=0&img_url=${encodeURIComponent(
          props.img_url,
        )}&title=${titleUri}&lazy_img_url=${encodeURIComponent(imgUrl)}`}
      >
        <CardActionArea className="pt-2 pb-2">
          <div className="container-fluid">
            <div className="row h-100 pl-3">
              {(props.img_url && (
                <div
                  className="col-3 my-auto"
                  style={{
                    backgroundImage: `url(${imgUrl})`,
                    backgroundColor: '#ccc',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center center',
                    backgroundSize: 'cover',
                    width: isSmall ? '35px' : '70px',
                    height: isSmall ? '35px' : '70px',
                  }}
                />
              )) || (
                <Skeleton
                  className="col-3 my-auto"
                  variant="rect"
                  width={70}
                  height={70}
                />
              )}
              <div className="col-9 my-auto">
                <Typography variant="subtitle">
                  {props.title || (
                    <>
                      <Skeleton variant="text" width="100%" />
                      <Skeleton variant="text" width="100%" />
                      <Skeleton variant="text" width="100%" />
                    </>
                  )}
                </Typography>
                {props.author && (
                  <>
                    <br />
                    <em>
                      <Link
                        color="textSecondary"
                        as={`/@${props.author}`}
                        href={`/blog?author=${props.author}`}
                      >
                        {`${isSmall ? '' : 'by '}@${props.author}`}
                      </Link>
                    </em>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardActionArea>
      </Link>
      {props.divider && <Divider variant="middle" className="pl-3 pr-3" />}
    </div>
  );
};

PostPreview.defaultProps = {
  author: undefined,
  permlink: undefined,
  img_url: undefined,
  title: undefined,
  divider: false,
};

PostPreview.propTypes = {
  author: PropTypes.string,
  permlink: PropTypes.string,
  img_url: PropTypes.string,
  title: PropTypes.string,
  divider: PropTypes.bool,
};

export default PostPreview;
