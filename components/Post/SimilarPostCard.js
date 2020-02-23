import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { makeStyles } from '@material-ui/core/styles';
import Skeleton from '@material-ui/lab/Skeleton';
import React from 'react';
import ProgressiveImage from 'react-progressive-image';
import { imageProxy } from 'tf-post-parser';
import Link from '../../lib/Link';
import Excerpt from '../Grid/Excerpt';

const useStyles = makeStyles(() => ({
  card: {
    borderRadius: 12,
  },
}));

const SimilarPostCard = props => {
  const classes = useStyles();

  const isSkeleton = !props.post.author;

  const cardImage = isSkeleton
    ? undefined
    : imageProxy(props.post.img_url, 300);

  const mediaPlaceholder = (
    <Skeleton variant="rect" width="100%" height={200} />
  );

  const card = (
    <Card key={props.post.permlink} className={classes.card}>
      <CardActionArea>
        {isSkeleton
          ? mediaPlaceholder
          : props.post.img_url && (
              <ProgressiveImage src={cardImage} placeholder={mediaPlaceholder}>
                {(src, loading) => {
                  if (loading) {
                    return (
                      <Skeleton variant="rect" width="100%" height={200} />
                    );
                  }
                  return (
                    <CardMedia
                      className="h-100"
                      style={{ minHeight: '200px' }}
                      image={cardImage}
                    />
                  );
                }}
              </ProgressiveImage>
            )}
        <CardContent>
          <div className="container" style={{ height: '150px' }}>
            <div className="row h-100">
              <div className="my-auto col-12 text-center">
                {isSkeleton ? (
                  <>
                    <Skeleton
                      variant="text"
                      width="30%"
                      height={18}
                      className="mx-auto"
                    />
                    <Skeleton
                      variant="text"
                      width="80%"
                      height={30}
                      className="mx-auto"
                    />
                    <Skeleton
                      variant="text"
                      width="70%"
                      height={30}
                      className="mx-auto"
                    />
                    <Skeleton
                      variant="text"
                      width="40%"
                      height={18}
                      className="mx-auto"
                    />
                  </>
                ) : (
                  <>
                    {(props.post.subdivision || props.post.city) && (
                      <Link
                        href="/destinations/[...destination]"
                        as={`/destinations/${props.slug}${
                          !props.post.subdivision
                            ? ''
                            : `/${props.post.subdivision}`
                        }${!props.post.city ? '' : `/${props.post.city}`}`}
                      >
                        {props.post.city || props.post.subdivision}
                      </Link>
                    )}
                    <Excerpt title={props.post.title} />
                    <em>
                      <Link
                        color="textSecondary"
                        as={`/@${props.post.author}`}
                        href="/[author]"
                      >
                        by @{props.post.author}
                      </Link>
                    </em>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
  );

  if (isSkeleton) return <div className={props.padding}>{card}</div>;

  return (
    <>
      <div className={props.padding}>
        <Link
          color="textPrimary"
          as={
            isSkeleton
              ? undefined
              : `/@${props.post.author}/${props.post.permlink}`
          }
          href={
            isSkeleton
              ? undefined
              : `/[author]/[permlink]?title=${encodeURIComponent(
                  props.post.title,
                )}&img_url=${encodeURIComponent(props.post.img_url)}&depth=0`
          }
        >
          {card}
        </Link>
      </div>
    </>
  );
};

export default SimilarPostCard;
