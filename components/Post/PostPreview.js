import CardActionArea from '@material-ui/core/CardActionArea';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
// import Link from '../../lib/Link';
import React from 'react';
import { imageProxy } from '../../helpers/getImage';
import Link from '../../lib/Link';

const Skeleton = dynamic(() => import('react-loading-skeleton'), {
  ssr: false,
});

const PostPreview = props => {
  return (
    <div key={props.author + props.permlink}>
      <Link
        color="textPrimary"
        as={`/@${props.author}/${props.permlink}`}
        href={`/post?author=${props.author}&permlink=${
          props.permlink
        }&depth=0&img_url=${encodeURIComponent(
          props.img_url,
        )}&title=${encodeURIComponent(props.title)}`}
        passHref
      >
        <a>
          <CardActionArea className="pt-2 pb-2">
            <div className="container-fluid">
              <div className="row h-100 pl-3">
                {(props.img_url && (
                  <div
                    className="col-3 my-auto"
                    style={{
                      backgroundImage: `url(${imageProxy(
                        props.img_url,
                        100,
                        100,
                      )})`,
                      backgroundColor: '#ccc',
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'center center',
                      backgroundSize: 'cover',
                      width: '70px',
                      height: '70px',
                    }}
                  />
                )) || <Skeleton width="70px" height="70px" />}
                <div className="col-9 my-auto">
                  <Typography variant="subtitle">
                    {props.title || <Skeleton count={2} />}
                  </Typography>
                  <br />
                  <em>
                    <Link
                      color="textSecondary"
                      as={`/@${props.author}`}
                      href={`/blog?author=${props.author}`}
                      passHref
                    >
                      <a>
                        {(props.author && `by @${props.author}`) || (
                          <Skeleton />
                        )}
                      </a>
                    </Link>
                  </em>
                </div>
              </div>
            </div>
          </CardActionArea>
        </a>
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
