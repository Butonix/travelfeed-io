/* eslint-disable no-use-before-define,curly,import/no-named-as-default-member,max-len,no-param-reassign,consistent-return,no-useless-escape */

/**
This function is extracted from the source code of steemhunt and condenser with some slight-
 * adjustments to meet our needs. Refer to the main one in case of future problems:
 * 
 * 
 * https://github.com/Steemhunt/web/blob/415e4086254b6cb23e91fa943aa6483dceab840a/src/components/Body/helpers/steemitHtmlReady.js
 * https://github.com/busyorg/busy/blob/a09049a4cb18103363fb578ebaec57b35c7d15e0/src/client/vendor/SanitizeConfig.js
 *
 *
 */
import embedjs from 'embedjs';
import xmldom from 'xmldom';
import { validateAccountName } from './ChainValidation';
import linksRe from './Links';

const noop = () => {};
const DOMParser = new xmldom.DOMParser({
  errorHandler: { warning: noop, error: noop },
});
const XMLSerializer = new xmldom.XMLSerializer();

/**
 * Functions performed by HTMLReady
 *
 * State reporting
 *  - hashtags: collect all #tags in content
 *  - usertags: collect all @mentions in content
 *  - htmltags: collect all html <tags> used (for validation)
 *  - images: collect all image URLs in content
 *  - links: collect all href URLs in content
 *
 * Mutations
 *  - link()
 *    - ensure all <a> href's begin with a protocol. prepend https:// otherwise.
 *  - iframe()
 *    - wrap all <iframe>s in <div class="videoWrapper"> for responsive sizing
 *  - img()
 *    - convert any <img> src IPFS prefixes to standard URL
 *    - change relative protocol to https://
 *  - linkifyNode()
 *    - scans text content to be turned into rich content
 *    - embedYouTubeNode()
 *      - identify plain youtube URLs and prep them for "rich embed"
 *    - linkify()
 *      - scan text for:
 *        - #tags, convert to <a> links
 *        - @mentions, convert to <a> links
 *        - naked URLs
 *          - if img URL, normalize URL and convert to <img> tag
 *          - otherwise, normalize URL and convert to <a> link
 *  - proxifyImages()
 *    - prepend proxy URL to any non-local <img> src's
 *
 * We could implement 2 levels of HTML mutation for maximum reuse:
 *  1. Normalization of HTML - non-proprietary, pre-rendering cleanup/normalization
 *    - (state reporting done at this level)
 *    - normalize URL protocols
 *    - convert naked URLs to images/links
 *    - convert embeddable URLs to <iframe>s
 *    - basic sanitization?
 *  2. Steemit.com Rendering - add in proprietary Steemit.com functions/links
 *    - convert <iframe>s to custom objects
 *    - linkify #tags and @mentions
 *    - proxify images
 *
 * TODO:
 *  - change url to normalizeUrl(url)
 *    - rewrite IPFS prefixes to valid URLs
 *    - schema normalization
 *    - gracefully handle protocols like ftp, mailto
 */

/** Split the HTML on top-level elements. This allows react to compare separately, preventing excessive re-rendering.
 * Used in MarkdownViewer.jsx
 */
// export function sectionHtml (html) {
//   const doc = DOMParser.parseFromString(html, 'text/html')
//   const sections = Array(...doc.childNodes).map(child => XMLSerializer.serializeToString(child))
//   return sections
// }

/** Embed videos, link mentions and hashtags, etc...
 */
export default function(html, { mutate = true, resolveIframe } = {}) {
  const state = { mutate, resolveIframe };
  state.hashtags = new Set();
  state.usertags = new Set();
  state.htmltags = new Set();
  state.images = new Set();
  state.links = new Set();
  try {
    const doc = DOMParser.parseFromString(html, 'text/html');
    traverse(doc, state);
    // console.log('state', state)
    if (!mutate) return state;
    return { html: doc ? XMLSerializer.serializeToString(doc) : '', ...state };
  } catch (error) {
    // Not Used, parseFromString might throw an error in the future
    return { html };
  }
}

function traverse(node, state, depth = 0) {
  if (!node || !node.childNodes) return;
  Object.values(node.childNodes).forEach(child => {
    // console.log(depth, 'child.tag,data', child.tagName, child.data)
    const tag = child.tagName ? child.tagName.toLowerCase() : null;
    if (tag) state.htmltags.add(tag);

    if (tag === 'img') img(state, child);
    else if (tag === 'iframe') iframe(state, child);
    else if (tag === 'a') link(state, child);
    else if (child.nodeName === '#text') linkifyNode(child, state);

    traverse(child, state, depth + 1);
  });
}

function link(state, child) {
  const url = child.getAttribute('href');
  if (url) {
    state.links.add(url);
    if (state.mutate) {
      // If this link is not relative, http, or https -- add https.
      if (!/^\/(?!\/)|(https?:)?\/\//.test(url)) {
        child.setAttribute('href', `https://${url}`);
      }
    }
  }
}

// wrap iframes in div.videoWrapper to control size/aspect ratio
function iframe(state, child) {
  const url = child.getAttribute('src');
  let domString;
  const embed = embedjs.get(url || '', { width: '100%', height: 400 });
  if (embed && embed.id) {
    const { images, links } = state;
    links.add(embed.url);
    images.add(`https://img.youtube.com/vi/${embed.id}/0.jpg`);
    if (!resolveIframe)
      domString = `~~~ embed:${embed.id} ${embed.provider_name} ${
        embed.url
      } ~~~`;
  }

  const { mutate, resolveIframe } = state;
  if (!mutate) return;

  const tag = child.parentNode.tagName
    ? child.parentNode.tagName.toLowerCase()
    : child.parentNode.tagName;
  if (
    tag === 'div' &&
    child.parentNode.getAttribute('class') === 'videoWrapper'
  )
    return;
  const html = XMLSerializer.serializeToString(child);
  if (resolveIframe) domString = `<div class="videoWrapper">${html}</div>`;
  child.parentNode.replaceChild(DOMParser.parseFromString(domString), child);
}

function img(state, child) {
  const url = child.getAttribute('src');
  if (url) {
    state.images.add(url);
    // if (state.mutate) {
    //   let url2 = url;
    //   if (/^\/\//.test(url2)) {
    //     // Change relative protocol imgs to https
    //     url2 = `https:${url2}`;
    //   }
    //   if (url2 !== url) {
    //     child.setAttribute("src", url2);
    //   }
    // }
  }
}

function linkifyNode(child, state) {
  try {
    const tag = child.parentNode.tagName
      ? child.parentNode.tagName.toLowerCase()
      : child.parentNode.tagName;
    if (tag === 'code') return;
    if (tag === 'a') return;

    const { mutate } = state;
    if (!child.data) return;

    if (isEmbedable(child, state.links, state.images, state.resolveIframe))
      return;

    const data = XMLSerializer.serializeToString(child);
    const content = linkify(
      data,
      state.mutate,
      state.hashtags,
      state.usertags,
      state.images,
      state.links,
    );
    if (mutate && content !== data) {
      const newChild = DOMParser.parseFromString(`<span>${content}</span>`);
      child.parentNode.replaceChild(newChild, child);
      return newChild;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error);
  }
}

function linkify(content, mutate, hashtags, usertags, images, links) {
  // usertag (mention)

  content = content.replace(
    /(^|[^a-zA-Z0-9_!#$%&*@＠\/]|(^|[^a-zA-Z0-9_+~.-\/#]))[@＠]([a-z][-\.a-z\d]+[a-z\d])/gi,
    (match, preceeding1, preceeding2, user) => {
      const userLower = user.toLowerCase();
      const valid = validateAccountName(userLower) == null;

      if (valid && usertags) usertags.add(userLower);

      const preceedings = (preceeding1 || '') + (preceeding2 || ''); // include the preceeding matches if they exist

      if (!mutate) return `${preceedings}${user}`;

      return valid
        ? `${preceedings}<a href="/@${userLower}">@${user}</a>`
        : `${preceedings}@${user}`;
    },
  );

  content = content.replace(linksRe.any, ln => {
    if (linksRe.image.test(ln)) {
      if (images) images.add(ln);
      return `<img src="${ln}" />`;
    }

    // do not linkify .exe or .zip urls
    if (/\.(zip|exe)$/i.test(ln)) return ln;

    if (links) links.add(ln);
    return `<a href="${ln}">${ln}</a>`;
  });

  // hashtag
  content = content.replace(/(^|\s)(#[-a-z\d]+)/gi, tag => {
    if (/#[\d]+$/.test(tag)) return tag; // Don't allow numbers to be tags
    const space = /^\s/.test(tag) ? tag[0] : '';
    const tag2 = tag.trim().substring(1);
    const tagLower = tag2.toLowerCase();
    if (hashtags) hashtags.add(tagLower);
    if (!mutate) return tag;
    return `${space}<a href="/created/${tagLower}">${tag}</a>`;
  });

  return content;
}

function isEmbedable(child, links, images, resolveIframe) {
  try {
    if (!child.data) return false;
    const { data } = child;
    const foundLinks = data.match(linksRe.any);
    if (!foundLinks) return false;
    const embed = embedjs.get(foundLinks[0] || '', {
      width: '100%',
      height: 400,
    });
    if (embed && embed.id) {
      const domString = resolveIframe
        ? embed.embed
        : `~~~ embed:${embed.id} ${embed.provider_name} ${embed.url} ~~~`;
      const v = DOMParser.parseFromString(domString);
      child.parentNode.replaceChild(v, child);
      // console.trace('embed.embed', v);
      if (links) links.add(embed.url);
      if (images) images.add(`https://img.youtube.com/vi/${embed.id}/0.jpg`);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

/** @return {id, url} or <b>null</b> */
/* function youTubeId(data) {
  if (!data) return null;

  const m1 = data.match(linksRe.youTube);
  const url = m1 ? m1[0] : null;
  if (!url) return null;

  const m2 = url.match(linksRe.youTubeId);
  const id = m2 && m2.length >= 2 ? m2[1] : null;
  if (!id) return null;

  return { id, url };
} */