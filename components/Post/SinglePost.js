/* eslint-disable no-shadow */
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Skeleton from '@material-ui/lab/Skeleton';
import { withStyles } from '@material-ui/styles';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { isWebpSupported } from 'react-image-webp/dist/utils';
import Carousel, { Modal, ModalGateway } from 'react-images';
import readingTime from 'reading-time';
import { imageProxy } from '../../helpers/getImage';
import parseHtmlToReact from '../../helpers/parseHtmlToReact';
import { getUser } from '../../helpers/token';
import Head from '../Header/Head';
import Header from '../Header/Header';
import PostMap from '../Maps/PostMap';
import PostAuthorProfile from '../Profile/PostAuthorProfile';
import LightboxCaption from './LightboxCaption';
import OrderBySelect from './OrderBySelect';
import PostCommentItem from './PostCommentItem';
import PostComments from './PostComments';
import PostContent from './PostContent';
import PostImageHeader from './PostImageHeader';
import PostSocialShares from './PostSocialShares';
import PostTitle from './PostTitle';
import SimilarPosts from './SimilarPosts';
import SliderTags from './SliderTags';
import StickyVoteSlider from './StickyVoteSlider';
import VoteDetailsBtn from './VoteDetailsBtn';

const styles = () => ({
  card: {
    borderRadius: 12,
  },
});

const SinglePost = props => {
  const {
    country_code,
    title,
    img_url,
    excerpt,
    canonicalUrl,
    created_at,
    display_name,
    tags,
    breadcrumbs,
    depth,
    root_author,
    root_permlink,
    author,
    bodycontent,
    isTf,
    htmlBody,
    sanitized,
    permlink,
    root_title,
    post_id,
    body,
    children,
    total_votes,
    votes,
    parent_author,
    parent_permlink,
    lazy_img_url,
    json,
    latitude,
    longitude,
    category,
    subdivision,
    curation_score,
    hasData,
    schema,
  } = props.post;

  const [webpSupport, setWebpSupport] = useState(undefined);
  const [cardWidth, setCardWidth] = useState(800);
  const [state, setState] = useState({
    title: 'Most smiles',
    orderby: 'total_votes',
    orderdir: 'DESC',
    userComment: undefined,
    lightboxIsOpen: false,
    lightboxIndex: 0,
  });

  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.offsetWidth) {
      const newCardWidth =
        Math.round((ref.current.offsetWidth + 100) / 100) * 100;
      setCardWidth(newCardWidth);
    }
    setWebpSupport(isWebpSupported());
  }, []);

  const toggleModal = () => {
    setState(state => ({ lightboxIsOpen: !state.lightboxIsOpen }));
  };

  const toggleLightbox = lightboxIndex => {
    setState(state => ({
      lightboxIsOpen: !state.lightboxIsOpen,
      lightboxIndex,
    }));
  };

  const handleClick = op => {
    setState(op);
  };

  const onCommentAdd = userComment => {
    setState({ userComment });
  };

  const { lightboxIsOpen } = state;

  const { classes } = props;

  const reactParsed = parseHtmlToReact(htmlBody, {
    cardWidth,
    hideimgcaptions: !isTf,
    toggleLightbox,
    webpSupport,
  });
  const { bodyText, images } = reactParsed;
  const readtime = readingTime(sanitized);

  return (
    <Fragment>
      <Head
        shorttitle={title}
        image={img_url}
        description={excerpt}
        canonicalUrl={canonicalUrl}
        type={{
          type: 'article',
          published_time: created_at,
          author: display_name,
          tags,
        }}
        breadcrumbs={breadcrumbs}
        scripts={
          schema ? (
            <script
              type="application/ld+json"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={schema}
            />
          ) : (
            undefined
          )
        }
      />
      <Header
        active="post"
        socialShare={{ author, permlink, tags, title, img_url }}
      />
      <div style={{ position: 'relative' }}>
        {depth > 0 ? (
          <>
            <Head
              shorttitle={`Re: ${root_title}`}
              description={excerpt}
              canonicalUrl={canonicalUrl}
              type={{
                type: 'article',
                published_time: created_at,
                author: display_name,
                tags,
              }}
            />
            <div className="w-100" style={{ position: 'relative' }}>
              <Grid container spacing={0} alignItems="center" justify="center">
                <Grid item lg={6} md={7} sm={10} xs={12} className="pb-4">
                  <div className="pt-2 pr-2 pl-2">
                    <PostCommentItem
                      loadreplies={false}
                      post={{
                        post_id,
                        body,
                        created_at,
                        children,
                        author,
                        display_name,
                        permlink,
                        depth,
                        total_votes,
                        votes,
                        parent_author,
                        parent_permlink,
                        root_author,
                        root_permlink,
                        root_title,
                      }}
                      title
                    />
                  </div>
                </Grid>
              </Grid>
            </div>
          </>
        ) : (
          <>
            {img_url && (
              <PostImageHeader
                lazyImage={
                  lazy_img_url || imageProxy(img_url, undefined, 10, 'fit')
                }
                backgroundImage={img_url}
                author={author}
                permlink={permlink}
                tags={tags}
                title={title}
                img_url={img_url}
                comments={children}
              />
            )}
            <div className="w-100" style={{ position: 'relative' }}>
              <Grid container spacing={0} alignItems="center" justify="center">
                <Grid item lg={6} md={7} sm={10} xs={12} className="pb-4">
                  <PostTitle title={title} />
                  <div ref={ref} id="post">
                    <Card className={classes.card}>
                      <PostContent
                        author={author}
                        id={post_id}
                        body={body}
                        json={json}
                        latitude={latitude}
                        longitude={longitude}
                        category={category}
                        isTf={isTf}
                        permlink={permlink}
                        display_name={display_name}
                        created_at={created_at}
                        readtime={readtime}
                        content={
                          bodycontent || (
                            <div className="textPrimary postcontent postCardContent postanchors">
                              {bodyText && bodyText.length > 0
                                ? bodyText
                                : [0, 1, 2, 3, 4, 5, 6, 7].map(() => (
                                    <Skeleton
                                      variant="text"
                                      width="100%"
                                      height={25}
                                    />
                                  ))}
                            </div>
                          )
                        }
                        country_code={country_code}
                        subdivision={subdivision}
                        tags={tags}
                        curationScore={curation_score}
                        title={title}
                        img_url={img_url}
                      />
                      {hasData && tags && tags.length > 0 && (
                        <>
                          <Divider variant="middle" />
                          <SliderTags tags={tags} />
                        </>
                      )}
                      {hasData && (
                        <div className="d-none d-xl-none d-lg-none d-sm-none d-md-block">
                          <Divider variant="middle" />
                          <Typography
                            variant="h5"
                            className="pt-4"
                            align="center"
                            gutterBottom
                          >
                            Share this post
                          </Typography>
                          <PostSocialShares
                            author={author}
                            permlink={permlink}
                            tags={tags}
                            title={title}
                            img_url={img_url}
                          />
                        </div>
                      )}
                      {latitude && (
                        <>
                          <Divider variant="middle" />
                          <div className="fullwidth">
                            <Typography
                              variant="h5"
                              className="p-2"
                              align="center"
                              gutterBottom
                            >
                              Post Location
                            </Typography>
                            <PostMap
                              cardWidth={cardWidth}
                              latitude={latitude}
                              longitude={longitude}
                            />
                          </div>
                        </>
                      )}
                      <div className="postCardContent">
                        <Divider variant="middle" />
                      </div>
                      <div className="container">
                        <div className="row justify-content-center">
                          <div className="col-lg-6 col-md-9 col-sm12">
                            <div className="text-center">
                              <Typography
                                variant="h5"
                                align="center"
                                className="p-2"
                                gutterBottom
                              >
                                Written by
                              </Typography>
                              <div className="pb-3">
                                <PostAuthorProfile
                                  author={author}
                                  display_name={display_name}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="pb-4">
                        <VoteDetailsBtn
                          numberreplies={children}
                          votes={votes}
                          total_votes={total_votes}
                        />
                      </div>
                    </Card>
                  </div>
                </Grid>
                {votes !== undefined && (
                  <StickyVoteSlider
                    author={author}
                    permlink={permlink}
                    votes={votes}
                    total_votes={total_votes}
                    children={children}
                    mode="gridcard"
                    depth={depth}
                    onCommentAdd={onCommentAdd}
                  />
                )}

                <Grid item lg={11} md={11} sm={11} xs={12} className="pb-5">
                  <div className="pt-2">
                    {country_code && (
                      <SimilarPosts country_code={country_code} />
                    )}
                  </div>
                </Grid>
              </Grid>
            </div>
          </>
        )}
        <Grid container spacing={0} alignItems="center" justify="center">
          <Grid item lg={6} md={7} sm={11} xs={12} className="pb-2">
            <div className="anchor" id="comments" name="comments" />
            <div className="container">
              <div className="row">
                <div className="col">
                  <Typography
                    variant="h5"
                    className="p-2 d-inline"
                    gutterBottom
                  >
                    Comments
                  </Typography>
                </div>
                <div className="col">
                  <OrderBySelect
                    handleClick={handleClick}
                    selection={state.title || 'Most smiles'}
                  />
                </div>
              </div>
            </div>
            {// "Fake" display new user comment after submitting comment without refreshing from the API
            state.userComment && (
              <Grid item lg={12} md={12} sm={12} xs={12} className="pb-2">
                <div className="pt-2 pr-2 pl-2">
                  <PostCommentItem
                    post={{
                      body: state.userComment.body,
                      created_at: new Date(),
                      children: 0,
                      author: getUser(),
                      display_name: '',
                      permlink: state.userComment.permlink,
                      depth: depth + 1,
                      total_votes: 0,
                      votes: '',
                      parent_author: author,
                      parent_permlink: permlink,
                      root_title: '',
                    }}
                  />
                </div>
              </Grid>
            )}
            {children !== 0 && (
              <Fragment>
                <div className="pr-2 pl-2">
                  <PostComments
                    hideCommentNumber
                    post_id={post_id}
                    orderby={state.orderby || 'total_votes'}
                    orderdir={state.orderdir || 'DESC'}
                    ismain
                  />
                </div>
              </Fragment>
            )}
          </Grid>
        </Grid>
      </div>
      {images && (
        <ModalGateway>
          {lightboxIsOpen ? (
            <Modal onClose={toggleModal} closeOnBackdropClick>
              <Carousel
                views={images}
                currentIndex={state.lightboxIndex}
                components={{ LightboxCaption }}
              />
            </Modal>
          ) : null}
        </ModalGateway>
      )}
    </Fragment>
  );
};

export default withStyles(styles)(SinglePost);
