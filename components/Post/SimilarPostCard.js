import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import React from 'react';
import { imageProxy } from '../../helpers/getImage';
import Link from '../../lib/Link';
import Excerpt from '../Grid/Excerpt';

const useStyles = makeStyles(() => ({
  card: {
    borderRadius: 12,
  },
}));

const SimilarPostCard = props => {
  const classes = useStyles();

  return (
    <>
      <div className={props.padding}>
        <Link
          color="textPrimary"
          as={`/@${props.post.author}/${props.post.permlink}`}
          href={`/post?author=${props.post.author}&permlink=${
            props.post.permlink
          }&title=${encodeURIComponent(
            props.post.title,
          )}&img_url=${encodeURIComponent(props.post.img_url)}&depth=0`}
        >
          <Card key={props.post.permlink} className={classes.card}>
            <CardActionArea>
              {props.post.img_url && (
                <CardMedia
                  className="h-100"
                  style={{ minHeight: '150px' }}
                  image={imageProxy(props.post.img_url, 300)}
                />
              )}
              <CardContent>
                <Excerpt title={props.post.title} />
                <em>
                  <Link
                    color="textSecondary"
                    as={`/@${props.post.author}`}
                    href={`/blog?author=${props.post.author}`}
                  >
                    by @{props.post.author}
                  </Link>
                </em>
              </CardContent>
            </CardActionArea>
          </Card>
        </Link>
      </div>
    </>
  );
};

export default SimilarPostCard;
