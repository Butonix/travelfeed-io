/* eslint-disable consistent-return */
import parse, { domToReact } from 'html-react-parser';
import React from 'react';
import Link from '../lib/Link';
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
