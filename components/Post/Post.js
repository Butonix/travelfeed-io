import { useQuery } from '@apollo/react-hooks';
import Button from '@material-ui/core/Button';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import sanitize from 'sanitize-html';
import canonicalLinker from '../../helpers/canonicalLinker';
import cleanTags from '../../helpers/cleanTags';
import { nameFromCC, slugFromCC } from '../../helpers/countryCodes';
import { imageProxy } from '../../helpers/getImage';
import { GET_POST } from '../../helpers/graphql/singlePost';
import parseBody from '../../helpers/parseBody';
import NotFoundAmp from '../Amp/NotFoundAmp';
import SinglePostAmp from '../Amp/SinglePostAmp';
import ErrorPage from '../General/ErrorPage';
import Header from '../Header/Header';
import SinglePost from './SinglePost';

const Post = props => {
  const { isAmp } = props;

  const [hideNsfw, setHideNsfw] = useState(true);

  const { error, data } = useQuery(GET_POST, {
    variables: props.post,
    ssr: true,
  });

  // 404 for error and if post does not exist
  if (error || (data && data.post && data.post.permlink === null))
    return isAmp ? (
      <NotFoundAmp />
    ) : (
      <>
        <Header />
        <ErrorPage statusCode={404} />
      </>
    );

  let children = 0;
  let is_travelfeed;
  let is_blacklisted;
  let is_nsfw;
  let root_title;
  let tags;
  let latitude;
  let longitude;
  let votes;
  let total_votes;
  let post_id;
  let parent_author;
  let parent_permlink;
  let root_author;
  let root_permlink;
  let json;
  let category;
  let city;
  let updated_at;
  let bodycontent;
  let schema;
  let excerpt;
  let canonicalUrl;
  let slug;
  let countryName;
  let body = '';
  let htmlBody = '';
  let sanitized = '';

  const breadcrumbs = [];

  let {
    author,
    permlink,
    title,
    display_name,
    img_url,
    created_at,
    depth,
    country_code,
    subdivision,
    app,
    curation_score,
  } = props.post;
  const { lazy_img_url } = props.post;
  if (depth) depth = parseInt(depth, 10);

  if (data && data.post && data.post.permlink) {
    is_travelfeed = data.post.is_travelfeed;
    depth = data.post.depth;
    is_blacklisted = data.post.is_blacklisted;
    is_nsfw = data.post.is_nsfw;
    app = data.post.app;
    root_title = data.post.root_title;
    tags = data.post.tags;
    latitude = data.post.latitude;
    longitude = data.post.longitude;
    votes = data.post.votes;
    total_votes = data.post.total_votes;
    post_id = data.post.post_id;
    children = data.post.children;
    parent_author = data.post.parent_author;
    parent_permlink = data.post.parent_permlink;
    root_author = data.post.root_author;
    root_permlink = data.post.root_permlink;
    author = data.post.author;
    permlink = data.post.permlink;
    title = data.post.title;
    body = data.post.body;
    display_name = data.post.display_name;
    img_url = data.post.img_url;
    created_at = data.post.created_at;
    country_code = data.post.country_code;
    subdivision = data.post.subdivision;
    city = data.post.city;
    json = data.post.json;
    category = data.post.category;
    curation_score = data.post.curation_score;
    updated_at = data.post.updated_at;

    if (depth > 0) title = `Re: ${root_title}`;
    htmlBody = parseBody(body, {});
    sanitized = sanitize(htmlBody, { allowedTags: [] });
    excerpt = `${sanitized.substring(0, 180)}[...] by ${author}`;
    canonicalUrl = canonicalLinker(json, app, category, author, permlink);
    slug = slugFromCC(country_code);
    countryName = nameFromCC(country_code);

    schema = {
      __html: `
          {
            "@context" : "http://schema.org",
            "@type" : "BlogPosting",
            "author" : {
              "@type" : "Person",
              "name" : "${display_name.replace(/"/g, '\\"')}"
            },
            "datePublished" : "${dayjs(created_at).format('YYYY-MM-DDTHH:MM')}",
            "image" : ${
              img_url
                ? `[
                "${imageProxy(img_url, 1920, 1920)}",
                "${imageProxy(img_url, 1920, 1440)}",
                "${imageProxy(img_url, 1920, 1080)}"
              ]`
                : `"https://steemitimages.com/u/${author}/avatar/large"`
            },
            "headline" : "${title.substring(0, 110).replace(/"/g, '\\"')}",
            "publisher" : {
                "@type": "Organization",
                "logo" : {
                    "@type": "ImageObject",
                    "width" : "378",
                    "height" : "60",
                    "url" : "https://img.travelfeed.io/amp-logo.png"
                },
                "name" : "TravelFeed"
            },
            "dateModified" : "${dayjs(updated_at).format('YYYY-MM-DDTHH:MM')}",
            "description" : "${excerpt.replace(/"/g, '\\"')}",
            "mainEntityOfPage" : "${canonicalUrl}"
          }
          `,
    };

    if (country_code) {
      breadcrumbs.push({
        position: 1,
        name: countryName,
        item: `https://travelfeed.io/destinations/${slug}`,
      });
    }
    if (subdivision) {
      breadcrumbs.push({
        position: 2,
        name: subdivision,
        item: `https://travelfeed.io/destinations/${slug}/${subdivision}`,
      });
    }
    if (city) {
      breadcrumbs.push({
        position: 3,
        name: city,
        item: `https://travelfeed.io/destinations/${slug}/${subdivision}/${city}`,
      });
    }
  }
  const isTf = app ? app.split('/')[0] === 'travelfeed' : false;

  tags = tags ? cleanTags(tags) : tags;

  if (body === '') body = 'Error: Could not load post. Are you online?';

  // Don't render invalid posts but return Steempeak link
  if (data && data.post && !is_travelfeed && depth === 0) {
    const url = `https://steempeak.com/@${author}/${permlink}`;
    return isAmp ? (
      <NotFoundAmp />
    ) : (
      <>
        <Header />
        <ErrorPage statusCode="invalid_post" url={url} />
      </>
    );
  }

  if (is_nsfw && hideNsfw && !isAmp) {
    bodycontent = (
      <div className="textPrimary postcontent postCardContent">
        <p>This post has been hidden as it is marked as not save for work.</p>
        <Button
          color="primary"
          variant="contained"
          onClick={() => setHideNsfw(false)}
        >
          Show post
        </Button>
      </div>
    );
  }

  if (is_blacklisted) {
    bodycontent = (
      <div className="textPrimary postcontent postCardContent">
        This post has been removed from TravelFeed.
      </div>
    );
  }

  const postProps = {
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
    slug,
    countryName,
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
    hasData: data && data.post,
    schema,
  };

  return isAmp ? (
    <SinglePostAmp post={postProps} />
  ) : (
    <SinglePost post={postProps} />
  );
};

export default Post;
