import sanitize from 'sanitize-html';
import TurndownService from 'turndown';
import sanitizeConfig from './PostParser/SanitizeConfig';

const turndownService = new TurndownService({ emDelimiter: '*' });

const json2md = data => {
  let html = '';
  if (!data || !data.blocks) return '';
  data.blocks.forEach(b => {
    if (b.type === 'paragraph') {
      html += `${turndownService.turndown(b.data.text)}\n\n`;
    } else if (b.type === 'code') {
      html += `${sanitize(
        b.data.code,
        sanitizeConfig({
          secureLinks: false,
          allLinksBlank: false,
        }),
      )}\n\n`;
    } else if (b.type === 'header') {
      html += `<h${b.data.level}>${b.data.text.replace(/\n/, ' ')}</h${
        b.data.level
      }>\n\n`;
    } else if (b.type === 'list') {
      if (b.data.style === 'ordered') {
        b.data.items.forEach((i, index) => {
          html += `${index + 1}. ${i}\n`;
        });
      } else {
        b.data.items.forEach(i => {
          html += `- ${i}\n`;
        });
      }
      html += '\n\n';
    } else if (b.type === 'image') {
      html += `<img alt="${sanitize(b.data.caption, {
        allowedTags: [],
      })}" src="${b.data.file.url}" ${
        b.data.file.width ? `width="${b.data.file.width}"` : ''
      } ${b.data.file.height ? `height="${b.data.file.height}"` : ''} />\n\n`;
    } else if (b.type === 'quote') {
      html += `> ${b.data.text}\n\n`;
    } else if (b.type === 'delimiter') {
      html += `<hr/>\n\n`;
    } else if (b.type === 'embed') {
      // Source is automatically rendered when parsing
      html += `${b.data.source}\n\n`;
    } else if (b.type === 'table') {
      // html += '<table>';
      b.data.content.forEach((c, index) => {
        html += '| ';
        if (index === 0) {
          c.forEach(t => {
            html += `${t} |`;
          });
          html += '\n|';
          c.forEach(() => {
            html += ` --- |`;
          });
        } else {
          c.forEach(t => {
            html += `${t} |`;
          });
        }
        html += '\n';
      });
      html += '\n\n';
    } else if (b.type === 'linkTool' && b.data.meta) {
      html += `\n\n<div json='${JSON.stringify(b)}'><a href='${
        b.data.link
      }'><center><img src='${b.data.meta.image}' alt='${
        b.data.meta.title
      }'/><h3>Read "${
        b.data.meta.title
      }" on TravelFeed.io</h3></center></a></div>\n\n`;
    }
  });
  return html;
};

export default json2md;
