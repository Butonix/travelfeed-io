/**
This function is extracted from the source code of busy.org and Condenser with some slight-
 * adjustments to meet our needs. Refer to the main one in case of future problems:
 * https://github.com/busyorg/busy/blob/27dd2383806eda8daf46748cbbbb26739d08ced4/src/client/components/Story/Body.js
 *
 */
//

import sanitizeHtml from "sanitize-html";
import sanitizeConfig from "./PostParser/SanitizeConfig";
import htmlReady from "./PostParser/HtmlReady";
import improve from "./PostParser/improve";
import Remarkable from "remarkable";
import {
  imageRegex,
  htmlComment,
  markdownComment,
  swmregex,
  dtubeImageRegex,
  dtubeLinkRegex
} from "../utils/regex";
import { ROOTURL } from "../config";

// Initialise Markdown parser
const remarkable = new Remarkable({
  html: true, // Remarkable renders first then sanitize runs...
  breaks: true,
  linkify: false, // linkify is done locally
  typographer: false, // https://github.com/jonschlinkert/remarkable/issues/142#issuecomment-221546793
  quotes: "“”‘’"
});

const parseBody = (body, options) => {
  // Remove HTML comments
  let parsedBody = body.replace(htmlComment, "");
  //remove markdown comment
  parsedBody = parsedBody.replace(markdownComment, "");
  //Remove partiko ads
  parsedBody = parsedBody.replace(/Posted using \[Partiko .*]\(.*\)/g, "");
  // Remove travelfeed ads
  parsedBody = parsedBody.replace(
    /<hr \/><center>View this post <a href="https:\/\/travelfeed\.io\/@.*">on the TravelFeed dApp<\/a> for the best experience\.<\/center>/g,
    ""
  );
  // Remove dclick ads
  parsedBody = parsedBody.replace(/\[!\[dclick-imagead]\(h.*\)]\(.*\)/g, "");
  parsedBody = parsedBody.replace(
    /#####.*<sub>.*\*\*Sponsored \( Powered by \[dclick]\(https:\/\/www\.dclick\.io\) \)\*\* <\/sub>/g,
    ""
  );
  // Remove tripsteem ads
  parsedBody = parsedBody.replace(
    /<a href='https:\/\/.*tripsteem\.com\/post\/.*'>.*<\/a>/g,
    ""
  );
  parsedBody = parsedBody.replace(
    /This is posted on <a href='https:\/\/en\.tripsteem\.com\/'><b>trips\.teem/g,
    ""
  );
  parsedBody = parsedBody.replace(
    /<a href='https:\/\/en\.tripsteem\.com\/'>!\[image]\(https:\/\/cdn\.steemitimages\.com\/DQmUjAKXsageaSrVo4CgqvDGePsw7CbVFRfNv91fQrW9kuL\/banner_en\.jpg\)<\/a>/g,
    ""
  );
  // Remove SWM snippets with description
  parsedBody = parsedBody.replace(
    /!\bsteemitworldmap\b\s((?:[-+]?(?:[1-8]?\d(?:\.\d+)?|90(?:\.0+)?)))\s\blat\b\s((?:[-+]?(?:180(?:\.0+)?|(?:(?:1[0-7]\d)|(?:[1-9]?\d))(?:\.\d+)?)))\s\blong.*d3scr/gi,
    ""
  );
  // Remove preview images in dtube posts with dtube embeds
  const dtubeMatch = dtubeImageRegex.exec(parsedBody);
  if (dtubeMatch && dtubeMatch[1] && dtubeMatch[2])
    parsedBody = parsedBody.replace(
      dtubeImageRegex,
      `<iframe
      src="https://emb.d.tube/#!/${dtubeMatch[1]}/${dtubeMatch[2]}"
        height="300"
        scrolling="no"
        frameborder="0"
        allowtransparency="true"
        allowfullscreen
        style="width: 100%;"
      />`
    );
  // Replace dtube links with dtube embeds
  parsedBody = parsedBody.replace(
    dtubeLinkRegex,
    `\n<iframe
  src="https://emb.d.tube/#!/$1"
    height="300"
    scrolling="no"
    frameborder="0"
    allowtransparency="true"
    allowfullscreen
    style="width: 100%;"
  />\n`
  );
  //remove remaining SWM snippets
  parsedBody = parsedBody.replace(swmregex, "");
  //Replace Steemit links with Travelfeed
  parsedBody = parsedBody.replace(/https:\/\/steemit\.com/g, ROOTURL);
  parsedBody = parsedBody.replace(/https:\/\/busy\.org/g, ROOTURL);
  parsedBody = parsedBody.replace(/https:\/\/steempeak\.com/g, ROOTURL);
  // Proxify Image urls
  // if (options.editor != true) {
  //   parsedBody = parsedBody.replace(
  //     imageRegex,
  //     "https://steemitimages.com/1000x0/$1"
  //   );
  //   // Latex
  //   parsedBody = improve(parsedBody);
  // }
  // Render markdown to HTML
  parsedBody = remarkable.render(parsedBody);
  const htmlReadyOptions = { mutate: true, resolveIframe: true };
  parsedBody = htmlReady(parsedBody, htmlReadyOptions).html;
  // Sanitize
  if (options.editor != true) {
    parsedBody = sanitizeHtml(
      parsedBody,
      sanitizeConfig({
        secureLinks: true
      })
    );
  } else {
    parsedBody = parsedBody.replace(/"\.\.\//g, `"${ROOTURL}`);
  }
  return parsedBody;
};

export default parseBody;
