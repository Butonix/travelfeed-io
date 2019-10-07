/* eslint-disable consistent-return */
import parse from 'html-react-parser';
import React from 'react';
import Link from '../lib/Link';
import { mentionUrl, postUrl } from './regex';

const parseOptions = {
  replace: ({ attribs, children }) => {
    if (!attribs) return;

    // Replace Steem post links with Link component
    if (attribs.href && attribs.href[0] === 'h' && children.length > 0) {
      const blogLink = attribs.href.match(postUrl);
      if (blogLink) {
        return (
          <Link
            as={`/@${blogLink[1]}/${blogLink[2]}`}
            href={`/post?author=${blogLink[1]}&permlink=${blogLink[2]}`}
          >
            {children[0].data}
          </Link>
        );
      }
    }
    // Replace local mentions with Link component
    if (attribs.href && attribs.href[1] === '@' && children.length > 0) {
      const mention = attribs.href.match(mentionUrl);
      if (mention) {
        return (
          <Link as={`/@${mention[1]}`} href={`/blog?author=${mention[1]}`}>
            {children[0].data}
          </Link>
        );
      }
    }
  },
};

const parseHtmlToReact = htmlBody => {
  return parse(htmlBody, parseOptions);
};

export default parseHtmlToReact;
