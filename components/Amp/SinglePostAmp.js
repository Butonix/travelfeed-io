import dayjs from 'dayjs';
import Link from 'next/link';
import React from 'react';
import { Query } from 'react-apollo';
import sanitize from 'sanitize-html';
import canonicalLinker from '../../helpers/canonicalLinker';
import { nameFromCC, slugFromCC } from '../../helpers/countryCodes';
import { imageProxy } from '../../helpers/getImage';
import { GET_POSTS } from '../../helpers/graphql/posts';
import { GET_POST } from '../../helpers/graphql/singlePost';
import parseBody from '../../helpers/parseBody';
import parseHtmlToReact from '../../helpers/parseHtmlToReact';
import Head from '../Header/Head';

const SinglePostAmp = props => {
  return (
    <>
      <Query query={GET_POST} variables={props.post}>
        {({ data, error }) => {
          if (data && data.post) {
            const {
              app,
              body,
              img_url,
              title,
              author,
              created_at,
              country_code,
              display_name,
              tags,
              json,
              category,
              permlink,
            } = data.post;
            const isTf = app && app.split('/')[0] === 'travelfeed';
            const htmlBody = parseBody(body, {});
            const bodyText = parseHtmlToReact(htmlBody, {
              amp: true,
              hideimgcaptions: !isTf,
            });
            const sanitized = sanitize(htmlBody, { allowedTags: [] });
            const excerpt = `${sanitized.substring(0, 180)}[...] by ${author}`;
            const canonicalUrl = canonicalLinker(
              json,
              app,
              category,
              author,
              permlink,
            );
            const slug = slugFromCC(country_code);
            const countryName = nameFromCC(country_code);
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
                  scripts={
                    <>
                      <script async="" src="https://cdn.ampproject.org/v0.js" />
                      <script async src="https://cdn.ampproject.org/v0.js" />
                      <script
                        async
                        custom-element="amp-social-share"
                        src="https://cdn.ampproject.org/v0/amp-social-share-0.1.js"
                      />
                      <script
                        custom-element="amp-sidebar"
                        src="https://cdn.ampproject.org/v0/amp-sidebar-0.1.js"
                        async=""
                      />
                      <link rel="stylesheet" type="text/css" href="/amp.css" />
                    </>
                  }
                />
                <header className="ampstart-headerbar fixed flex justify-start items-center top-0 left-0 right-0 pl2 pr4 ">
                  <div
                    role="button"
                    aria-label="open sidebar"
                    on="tap:header-sidebar.toggle"
                    tabIndex="0"
                    className="ampstart-navbar-trigger  pr2  "
                  >
                    ☰
                  </div>
                  <div className="site-name">TravelFeed</div>
                </header>
                <amp-sidebar
                  id="header-sidebar"
                  className="ampstart-sidebar px3  "
                  layout="nodisplay"
                >
                  <div className="flex justify-start items-center ampstart-sidebar-header">
                    <div
                      role="button"
                      aria-label="close sidebar"
                      on="tap:header-sidebar.toggle"
                      tabIndex="0"
                      className="ampstart-navbar-trigger items-start"
                    >
                      ✕
                    </div>
                  </div>

                  <ul className="ampstart-sidebar-faq list-reset m0">
                    <li className="ampstart-faq-item">
                      <Link href="/" className="text-decoration-none">
                        Home
                      </Link>
                    </li>
                    <li className="ampstart-faq-item">
                      <Link href="/discover" className="text-decoration-none">
                        Discover
                      </Link>
                    </li>
                    <li className="ampstart-faq-item">
                      <Link
                        href="/destination"
                        className="text-decoration-none"
                      >
                        Destinations
                      </Link>
                    </li>
                    <li className="ampstart-faq-item">
                      <Link href="/topics" className="text-decoration-none">
                        Topics
                      </Link>
                    </li>
                    <li className="ampstart-faq-item">
                      <Link href="/map" className="text-decoration-none">
                        Map
                      </Link>
                    </li>
                  </ul>
                </amp-sidebar>
                <figure className="ampstart-image-fullpage-hero m0 relative mb4">
                  <amp-img
                    height="720"
                    alt="The Year&#39;s Best Animal Photos"
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
                        <Link
                          as={`/@${author}`}
                          href={`/blog?author=${author}`}
                        >
                          {display_name}
                        </Link>
                        ,<br /> {dayjs(created_at).format('MMMM DD, YYYY')}
                      </span>
                    </header>
                    <footer className="absolute left-0 right-0 bottom-0">
                      <a
                        className="ampstart-readmore py3 caps line-height-2 text-decoration-none center block h5"
                        href="#content"
                      >
                        <span className="ampstart-readmore-text px1">
                          Read more
                        </span>
                      </a>
                    </footer>
                  </div>
                </figure>
                <main id="content" role="main" className="">
                  <article className="photo-article">
                    <div className="postcontent">{bodyText}</div>
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
                  <Query
                    query={GET_POSTS}
                    variables={{
                      orderby: 'random',
                      country_code,
                      min_curation_score: 5000,
                      limit: 3,
                    }}
                  >
                    {({ data }) => {
                      if (data && data.posts) {
                        return (
                          <>
                            <section className="ampstart-related-section mb4 px3">
                              <h2 className="h3 mb1 mt4">
                                <Link
                                  color="inherit"
                                  href={`/destinations?country=${slug}`}
                                  as={`/destinations/${slug}`}
                                >
                                  {`More from ${countryName}`}
                                </Link>
                              </h2>
                              <ul className="ampstart-related-section-items list-reset flex flex-wrap m0">
                                {data.posts.map(post => {
                                  return (
                                    <li className="col-12 sm-col-4 md-col-4 lg-col-4 pr2 py2">
                                      <figure className="ampstart-image-with-caption m0 relative mb4">
                                        <amp-img
                                          src={imageProxy(
                                            post.img_url,
                                            233,
                                            202,
                                          )}
                                          width="233"
                                          height="202"
                                          alt="Bullseye view: Bird Watching 101"
                                          layout="responsive"
                                        />
                                        <figcaption className="h5 mt1 px3">
                                          <Link
                                            as={`/@${post.author}/${post.permlink}`}
                                            href={`/post?author=${post.author}&permlink=${post.permlink}`}
                                          >
                                            {post.title}
                                          </Link>{' '}
                                          by{' '}
                                          <Link
                                            as={`/@${post.author}`}
                                            href={`/blog?author=${post.author}`}
                                          >
                                            {post.author}
                                          </Link>
                                        </figcaption>
                                      </figure>
                                    </li>
                                  );
                                })}
                              </ul>
                            </section>
                          </>
                        );
                      }
                      return <></>;
                    }}
                  </Query>
                </main>
                <footer className="ampstart-footer flex flex-column items-center px3 ">
                  <small>TravelFeed - Travel, Write, Earn</small>
                  <a href="/join" className="text-decoration-none">
                    <button className="ampstart-btn mt3">
                      START YOUR FREE TRAVEL BLOG
                    </button>
                  </a>
                </footer>
                <amp-pixel src="https://matomo.travelfeed.io/matomo.php?idsite=1&amp;rec=1&amp;action_name=TITLE&amp;urlref=DOCUMENT_REFERRER&amp;url=CANONICAL_URL&amp;rand=RANDOM" />
              </>
            );
          }
          return 'Not found';
        }}
      </Query>
      <style amp-custom="" jsx>
        {`
          .site-name {
            font-size: 2em;
          }
        `}
      </style>
    </>
  );
};

export default SinglePostAmp;
