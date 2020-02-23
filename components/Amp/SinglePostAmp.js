import { useQuery } from '@apollo/react-hooks';
import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react';
import { imageProxy } from 'tf-post-parser';
import { GET_RECOMMENDED_POSTS } from '../../helpers/graphql/posts';
import parseHtmlToReact from '../../helpers/parseHtmlToReact';
import Head from '../Header/Head';
import HeaderAmp from './HeaderAmp';
import StylesAmp from './StylesAmp';

const SinglePostAmp = props => {
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
    slug,
    countryName,
    isTf,
    htmlBody,
    schema,
  } = props.post;

  const reactParsed = parseHtmlToReact(htmlBody, {
    amp: true,
    hideimgcaptions: !isTf,
  });
  const { bodyText, embeds } = reactParsed;

  const recommendations = useQuery(GET_RECOMMENDED_POSTS, {
    variables: {
      orderby: 'random',
      country_code,
      min_curation_score: 9000,
      limit: 3,
    },
  });

  return (
    <>
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
          <>
            <script async src="https://cdn.ampproject.org/v0.js" />
            <script
              async
              custom-element="amp-social-share"
              src="https://cdn.ampproject.org/v0/amp-social-share-0.1.js"
            />
            <script
              async
              custom-element="amp-sidebar"
              src="https://cdn.ampproject.org/v0/amp-sidebar-0.1.js"
            />
            {embeds.youtube && (
              <script
                async
                custom-element="amp-youtube"
                src="https://cdn.ampproject.org/v0/amp-youtube-0.1.js"
              />
            )}
            {embeds.iframe && (
              <script
                async
                custom-element="amp-iframe"
                src="https://cdn.ampproject.org/v0/amp-iframe-0.1.js"
              />
            )}
            {embeds.vimeo && (
              <script
                async
                custom-element="amp-vimeo"
                src="https://cdn.ampproject.org/v0/amp-vimeo-0.1.js"
              />
            )}
            {embeds.instagram && (
              <script
                async
                custom-element="amp-instagram"
                src="https://cdn.ampproject.org/v0/amp-instagram-0.1.js"
              />
            )}
            {embeds.carousel && (
              <script
                async
                custom-element="amp-carousel"
                src="https://cdn.ampproject.org/v0/amp-carousel-0.1.js"
              />
            )}
            {embeds.selector && (
              <script
                async
                custom-element="amp-selector"
                src="https://cdn.ampproject.org/v0/amp-selector-0.1.js"
              />
            )}
            {embeds.lightbox && (
              <script
                async
                custom-element="amp-lightbox-gallery"
                src="https://cdn.ampproject.org/v0/amp-lightbox-gallery-0.1.js"
              />
            )}
            {schema && (
              <script
                type="application/ld+json"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={schema}
              />
            )}
          </>
        }
      />
      <HeaderAmp />
      {depth === 0 && img_url && (
        <figure className="ampstart-image-fullpage-hero m0 relative mb4">
          <amp-img
            height="720"
            alt={title}
            layout="fixed-height"
            src={imageProxy(img_url, undefined, 720, 'fit')}
          />
          <div className="absolute top-0 right-0 bottom-0 left-0">
            <header className="p3">
              <h1 className="ampstart-fullpage-hero-heading mb3">
                <span className="ampstart-fullpage-hero-heading-text">
                  {title}
                </span>
              </h1>

              <span className="ampstart-image-credit h4">
                By{' '}
                <Link as={`/@${author}`} href="/[author]">
                  <a>{display_name}</a>
                </Link>
                ,<br /> {dayjs(created_at).format('MMMM DD, YYYY')}
              </span>
            </header>
            <footer className="absolute left-0 right-0 bottom-0">
              <a
                className="ampstart-readmore py3 caps line-height-2 text-decoration-none center block h5"
                href="#content"
              >
                <span className="ampstart-readmore-text px1">Read more</span>
              </a>
            </footer>
          </div>
        </figure>
      )}
      <main id="content" role="main" className="">
        <article className="photo-article">
          <div className="postcontent postanchors">
            {(depth > 0 || !img_url) && (
              <>
                <h1 className="pt3">
                  <Link
                    as={`/@${root_author}/${root_permlink}?amp=1`}
                    href="/[author]/[permlink]"
                  >
                    <a>{title}</a>
                  </Link>
                </h1>
                <p>
                  <em>
                    by{' '}
                    <Link as={`/@${author}`} href="/[author]">
                      <a>{display_name}</a>
                    </Link>
                  </em>
                </p>
              </>
            )}
            {bodycontent || bodyText}
          </div>
        </article>
        <p className="heading">
          <amp-social-share type="twitter" width="45" height="33" />
          <amp-social-share
            type="facebook"
            width="45"
            height="33"
            data-attribution="254325784911610"
          />
          <amp-social-share type="email" width="45" height="33" />
          <amp-social-share type="pinterest" width="45" height="33" />
        </p>
        {recommendations &&
        recommendations.data &&
        recommendations.data.posts ? (
          <>
            <section className="ampstart-related-section mb4 px3">
              <h2 className="h3 mb1 mt4">
                <Link
                  color="inherit"
                  href="/destinations/[...destination]"
                  as={`/destinations/${slug}`}
                >
                  <a>
                    {countryName
                      ? `More from ${countryName}`
                      : 'Recommended for you'}
                  </a>
                </Link>
              </h2>
              <ul className="ampstart-related-section-items list-reset flex flex-wrap m0">
                {recommendations.data.posts.map(post => {
                  return (
                    <li className="col-12 sm-col-4 md-col-4 lg-col-4 pr2 py2">
                      <figure className="ampstart-image-with-caption m0 relative mb4">
                        <amp-img
                          src={imageProxy(post.img_url, 233, 202)}
                          width="233"
                          height="202"
                          alt={post.title}
                          layout="responsive"
                        />
                        <figcaption className="h5 mt1 px3">
                          <Link
                            as={`/@${post.author}/${post.permlink}?amp=1`}
                            href="/[author]/[permlink]"
                          >
                            <a>{post.title}</a>
                          </Link>{' '}
                          by{' '}
                          <Link as={`/@${post.author}`} href="/[author]">
                            <a>{post.display_name}</a>
                          </Link>
                        </figcaption>
                      </figure>
                    </li>
                  );
                })}
              </ul>
            </section>
          </>
        ) : (
          <></>
        )}
      </main>
      <footer className="ampstart-footer flex flex-column items-center px3 ">
        <small>TravelFeed - Travel, Write, Earn</small>
        <a href="/join" className="text-decoration-none">
          <button className="ampstart-btn mt3">
            START YOUR FREE TRAVEL BLOG
          </button>
        </a>
      </footer>
      <StylesAmp />
    </>
  );
};

export default SinglePostAmp;
