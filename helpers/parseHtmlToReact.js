/* eslint-disable consistent-return */
import parse, { domToReact } from 'html-react-parser';
import React from 'react';
import InstagramEmbed from 'react-instagram-embed';
import LinkTool from '../components/Post/DynamicPostComponents/LinkTool';
import Link from '../lib/Link';
import { imageProxy } from './getImage';
import { exitUrl, instagramPost, mentionUrl, postUrl } from './regex';

const parseHtmlToReact = (htmlBody, options) => {
  const embeds = {};
  const parseLinksToBlank = options && options.parseLinksToBlank === true;

  const parseOptions = {
    replace: ({ attribs, children }) => {
      if (!attribs) return;

      // Open links in new tab
      if (parseLinksToBlank && attribs.href) {
        // eslint-disable-next-line no-param-reassign
        attribs.target = '_blank';
        return;
      }

      // Proxify image urls and add lazyload and conditional webp
      if (
        attribs.src &&
        attribs.frameborder === undefined &&
        attribs.allowfullscreen === undefined
      ) {
        const doNotConvert =
          attribs.src.substr(attribs.src.length - 4) === '.gif';
        if (options.lazy === false) {
          return (
            <figure>
              <img
                className="loaded"
                alt={attribs.alt}
                src={
                  doNotConvert
                    ? attribs.src
                    : imageProxy(attribs.src, 1800, undefined, 'fit')
                }
              />
              {attribs.alt !== undefined &&
                // ignore alt texts with image name
                !attribs.alt.match(/(DSC_|\.gif|\.jpg|\.png)/i) &&
                !options.hideimgcaptions && (
                  <figcaption>{attribs.alt}</figcaption>
                )}
            </figure>
          );
        }
        if (options.amp) {
          return (
            <figure className="ampstart-image-with-caption m0 relative mb4">
              <div className="fixed-height-container">
                <amp-img
                  src={
                    doNotConvert
                      ? attribs.src
                      : imageProxy(attribs.src, undefined, 500, 'fit')
                  }
                  class="contain"
                  layout="fill"
                />
              </div>
              {attribs.alt !== undefined &&
                // ignore alt texts with image name
                !attribs.alt.match(/(DSC_|\.gif|\.jpg|\.png)/i) &&
                !options.hideimgcaptions && (
                  <figcaption>{attribs.alt}</figcaption>
                )}
            </figure>
          );
        }
        return (
          <figure>
            <picture>
              <source
                type="image/webp"
                data-srcset={
                  doNotConvert
                    ? attribs.src
                    : imageProxy(
                        attribs.src,
                        options.cardWidth,
                        undefined,
                        'fit',
                        'webp',
                      )
                }
                data-sizes="100w"
              />
              <img
                alt={attribs.alt}
                className="lazy"
                src={imageProxy(attribs.src, undefined, 50, 'fit')}
                data-src={
                  doNotConvert
                    ? attribs.src
                    : imageProxy(
                        attribs.src,
                        options.cardWidth,
                        undefined,
                        'fit',
                      )
                }
                data-sizes="100w"
              />
            </picture>
            {attribs.alt !== undefined &&
              // ignore alt texts with image name
              !attribs.alt.match(/(DSC_|\.gif|\.jpg|\.png)/i) &&
              !options.hideimgcaptions && (
                <figcaption>{attribs.alt}</figcaption>
              )}
          </figure>
        );
      }

      // Replace exit urls with Link component
      if (attribs.href && attribs.href[0] === '/' && children.length > 0) {
        const exitLink = attribs.href.match(exitUrl);
        if (exitLink) {
          return (
            <Link href={`/exit?url=${exitLink[1]}`}>
              {domToReact(children, parseOptions)}
            </Link>
          );
        }
      }

      // Replace Steem post links with Link component
      if (attribs.href && attribs.href[0] === 'h' && children.length > 0) {
        const blogLink = attribs.href.match(postUrl);
        if (blogLink) {
          return (
            <Link
              as={`/@${blogLink[1]}/${blogLink[2]}`}
              href={`/post?author=${blogLink[1]}&permlink=${blogLink[2]}`}
            >
              {domToReact(children, parseOptions)}
            </Link>
          );
        }
      }
      // Replace local mentions with Link component
      if (attribs.href && children.length > 0) {
        const mention = attribs.href.match(mentionUrl);
        if (mention) {
          return (
            <Link as={`/@${mention[1]}`} href={`/blog?author=${mention[1]}`}>
              {domToReact(children, parseOptions)}
            </Link>
          );
        }
      }
      if (attribs.json) {
        let json = {};
        let title = '';
        let description = '';
        let image = '';
        let author = '';
        let permlink = '';
        try {
          json = JSON.parse(attribs.json);
          title = json.data.meta.title;
          description = json.data.meta.description;
          image = json.data.meta.image;
          author = json.data.meta.author;
          permlink = json.data.meta.permlink;
        } catch {
          return;
        }
        if (json.type === 'linkTool')
          return (
            <>
              <LinkTool
                author={author}
                permlink={permlink}
                title={title}
                description={description}
                image={image}
              />
            </>
          );
      }
      if (attribs.src && attribs.frameborder !== undefined) {
        if (!options.amp) {
          const igmatch = /(?:http[s]?:\/\/)?(?:www.)?instagram\.com\/p\/(.*)\//i.exec(
            attribs.src,
          );
          if (igmatch) {
            return (
              <div className="container pt-2">
                <div className="row justify-content-center">
                  <div className="col-xl-6 col-lg-6 col-md-8 col-sm-10 col-12">
                    <InstagramEmbed
                      url={`https://www.instagram.com/p/${igmatch[1]}`}
                      maxWidth={600}
                      hideCaption
                    />
                  </div>
                </div>
              </div>
            );
          }
        } else {
          const ytmatch = /https:\/\/www\.youtube\.com\/embed\/(.*)/.exec(
            attribs.src,
          );
          if (ytmatch) {
            embeds.youtube = true;
            return (
              <amp-youtube
                data-videoid={ytmatch[1]}
                layout="responsive"
                width={attribs.width}
                height={attribs.height}
              />
            );
          }
          const vmmatch = /https:\/\/player\.vimeo\.com\/video\/([0-9]*)/.exec(
            attribs.src,
          );
          if (vmmatch) {
            embeds.vimeo = true;
            return (
              <amp-vimeo
                data-videoid={vmmatch[1]}
                layout="responsive"
                width={attribs.width || '960'}
                height={attribs.height || '540'}
              />
            );
          }
          const igmatch = instagramPost.exec(attribs.src);
          if (igmatch) {
            embeds.instagram = true;
            return (
              <amp-instagram
                data-shortcode={igmatch[1]}
                width="400"
                height="400"
                layout="responsive"
              />
            );
          }
          embeds.iframe = true;
          return (
            <amp-iframe
              allowfullscreen={attribs.allowfullscreen}
              width={attribs.width || '800'}
              height={attribs.height || '400'}
              sandbox="allow-scripts allow-same-origin"
              layout="responsive"
              frameborder="0"
              src={attribs.src}
            />
          );
        }
      }
    },
  };

  return { bodyText: parse(htmlBody, parseOptions), embeds };
};

export default parseHtmlToReact;
