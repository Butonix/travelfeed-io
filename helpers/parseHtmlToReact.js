/* eslint-disable consistent-return */
import parse, { domToReact } from 'html-react-parser';
import React from 'react';
import Link from '../lib/Link';
import { imageProxy } from './getImage';
import { exitUrl, mentionUrl, postUrl } from './regex';

const parseHtmlToReact = (htmlBody, options) => {
  const parseLinksToBlank = options && options.parseLinksToBlank === true;

  const parseOptions = {
    replace: ({ attribs, children }) => {
      if (!attribs) return;

      // Open links in new tab
      if (parseLinksToBlank && attribs.href) {
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
              <amp-img
                src={
                  doNotConvert
                    ? attribs.src
                    : imageProxy(attribs.src, undefined, 400, 'fit')
                }
                layout="fixed-height"
                height="400"
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
    },
  };

  return parse(htmlBody, parseOptions);
};

export default parseHtmlToReact;
