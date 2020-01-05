/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/iframe-has-title */
/* eslint-disable consistent-return */
import Skeleton from '@material-ui/lab/Skeleton';
import parse, { domToReact } from 'html-react-parser';
import React from 'react';
import InstagramEmbed from 'react-instagram-embed';
import LazyLoad from 'react-lazyload';
import ProgressiveImage from 'react-progressive-image';
import LinkTool from '../components/Post/DynamicPostComponents/LinkTool';
import Link from '../lib/Link';
import { imageProxy } from './getImage';
import { exitUrl, instagramPost, mentionUrl, postUrl } from './regex';

const parseHtmlToReact = (htmlBody, options) => {
  const isWebp = options.webpSupport;

  const embeds = {};
  const images = [];
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
        const imgHeight = attribs.height || '100%';
        const imgWidth = attribs.width || undefined;
        const fetchHeight =
          attribs.height && attribs.height > 0 && attribs.height < 700
            ? attribs.height
            : 700;
        let webpSrc = doNotConvert
          ? attribs.src
          : imageProxy(attribs.src, undefined, fetchHeight, 'fit', 'webp');
        let regSrc = doNotConvert
          ? attribs.src
          : imageProxy(attribs.src, undefined, fetchHeight, 'fit');
        if (options.cardWidth && options.cardWidth <= 500) {
          // on mobile, loading a smaller version is sufficient
          webpSrc = doNotConvert
            ? attribs.src
            : imageProxy(
                attribs.src,
                options.cardWidth,
                undefined,
                'fit',
                'webp',
              );
          regSrc = doNotConvert
            ? attribs.src
            : imageProxy(attribs.src, options.cardWidth, undefined, 'fit');
        }
        const lightboxImg = { src: isWebp ? webpSrc : regSrc };
        if (!options.hideimgcaptions && attribs.alt)
          lightboxImg.caption = attribs.alt;
        const useLightbox =
          options.toggleLightbox && (!attribs.height || attribs.height > 400);
        let handleLightboxToggle;
        let lightboxClass;
        if (useLightbox) {
          images.push(lightboxImg);
          const lightboxPos = images.length - 1;
          handleLightboxToggle = () => options.toggleLightbox(lightboxPos);
          lightboxClass = 'cpointer';
        }
        if (options.amp) {
          return (
            <figure className="ampstart-image-with-caption m0 relative mb4">
              {(attribs.height && attribs.width && (
                <amp-img
                  alt={attribs.alt}
                  layout="responsive"
                  src={webpSrc}
                  width={attribs.width}
                  height={attribs.height}
                >
                  <amp-img
                    alt={attribs.alt}
                    fallback
                    layout="responsive"
                    src={regSrc}
                    width={attribs.width}
                    height={attribs.height}
                  />
                </amp-img>
              )) || (
                <div className="fixed-height-container">
                  <amp-img
                    alt={attribs.alt}
                    src={webpSrc}
                    class="contain"
                    layout="fill"
                  >
                    <amp-img
                      alt={attribs.alt}
                      fallback
                      src={regSrc}
                      class="contain"
                      layout="fill"
                    />
                  </amp-img>
                </div>
              )}
              {attribs.alt !== undefined &&
                // ignore alt texts with image name
                !attribs.alt.match(/(DSC_|\.gif|\.jpg|\.png)/i) &&
                !options.hideimgcaptions && (
                  <figcaption>{attribs.alt}</figcaption>
                )}
            </figure>
          );
        }
        if (
          options.lazy !== false &&
          attribs.height &&
          attribs.width &&
          attribs.height > 200
        ) {
          const lazyStyle = {
            maxHeight: `${
              attribs.height && attribs.height < 550 ? attribs.height : '550'
            }px`,
            maxWidth: `${imgWidth}px`,
            width: imgHeight > imgWidth ? 'auto' : '100%',
            height:
              imgHeight > imgWidth
                ? `${
                    attribs.height && attribs.height < 550
                      ? attribs.height
                      : '550'
                  }px`
                : 'auto',
          };
          return (
            <div
              onClick={handleLightboxToggle}
              onKeyPress={handleLightboxToggle}
              role="button"
              className={lightboxClass}
            >
              <figure>
                <LazyLoad
                  offset={700}
                  once
                  placeholder={
                    <picture className="lazyImage">
                      <img
                        alt={attribs.alt}
                        src={imageProxy(
                          attribs.src,
                          undefined,
                          fetchHeight < 50 ? fetchHeight : 50,
                          'fit',
                        )}
                        className="img-fluid mx-auto d-block"
                        style={lazyStyle}
                        height={imgHeight}
                        width={imgWidth}
                      />
                    </picture>
                  }
                >
                  <ProgressiveImage
                    src={isWebp ? webpSrc : regSrc}
                    placeholder={imageProxy(
                      attribs.src,
                      undefined,
                      fetchHeight < 50 ? fetchHeight : 50,
                      'fit',
                    )}
                  >
                    {src => (
                      <picture className="lazyImage">
                        <img
                          alt={attribs.alt}
                          src={src}
                          className="img-fluid mx-auto d-block"
                          height={imgHeight}
                          width={imgWidth}
                          style={lazyStyle}
                        />
                      </picture>
                    )}
                  </ProgressiveImage>
                </LazyLoad>
                {attribs.alt !== undefined &&
                  // ignore alt texts with image name
                  !attribs.alt.match(/(DSC_|\.gif|\.jpg|\.png)/i) &&
                  !options.hideimgcaptions && (
                    <figcaption>{attribs.alt}</figcaption>
                  )}
              </figure>
            </div>
          );
        }
        return (
          <div
            onClick={handleLightboxToggle}
            onKeyPress={handleLightboxToggle}
            role="button"
            className={lightboxClass}
          >
            <figure>
              <picture>
                <source type="image/webp" srcSet={webpSrc} />
                <img
                  alt={attribs.alt}
                  src={regSrc}
                  className="img-fluid mx-auto d-block"
                  style={{ maxHeight: '550px' }}
                  height={imgHeight}
                  width={imgWidth}
                />
              </picture>
              {attribs.alt !== undefined &&
                // ignore alt texts with image name
                !attribs.alt.match(/(DSC_|\.gif|\.jpg|\.png)/i) &&
                !options.hideimgcaptions && (
                  <figcaption>{attribs.alt}</figcaption>
                )}
            </figure>
          </div>
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
              <div className="container-fluid pt-2">
                <div className="row justify-content-center">
                  <div className="col-xl-8 col-lg-8 col-md-8 col-sm-10 col-12 p-0">
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
          return (
            <LazyLoad
              once
              offset={700}
              placeholder={
                <Skeleton variant="rect" width="100%" height={attribs.height} />
              }
            >
              <iframe {...attribs} />
            </LazyLoad>
          );
        }
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
    },
  };

  return { bodyText: parse(htmlBody, parseOptions), embeds, images };
};

export default parseHtmlToReact;
