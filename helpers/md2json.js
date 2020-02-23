import { parseBody } from 'tf-post-parser';
import { tfJSON } from './regex';

const md2json = (d, useTextBlocks) => {
  try {
    const json = { time: 1564842925324, blocks: [], version: '2.15.0' };
    if (!d) return { success: true, json };
    const data = `${d}\n\n`.replace(/\n([a-zA-Z!#])/, '\n\n$1');
    const paragraphs = data.split('\n\n');
    paragraphs.forEach(para => {
      const p = para.replace(/^\n/, '');
      let block;
      // tfJSON handling
      const tfjsonMatch = tfJSON.exec(p);
      if (tfjsonMatch) {
        try {
          block = JSON.parse(`{${tfjsonMatch[1]}}`);
        } catch {
          block = {
            data: { code: parseBody(p, { secureLinks: false }) },
            type: 'code',
          };
        }
      }
      // Header markdown
      else if (p.match(/^#/)) {
        try {
          let level = 1;
          let text = p;
          if (p.match(/^# /)) {
            text = text.replace(/^# /, '');
          } else if (p.match(/^## /)) {
            text = text.replace(/^## /, '');
            level = 2;
          } else if (p.match(/^### /)) {
            text = text.replace(/^### /, '');
            level = 3;
          } else if (p.match(/^#### /)) {
            text = text.replace(/^#### /, '');
            level = 4;
          } else if (p.match(/^##### /)) {
            text = text.replace(/^##### /, '');
            level = 5;
          } else if (p.match(/^###### /)) {
            text = text.replace(/^###### /, '');
            level = 6;
          }
          block = { data: { text, level }, type: 'header' };
        } catch {
          block = {
            data: { code: parseBody(p, { secureLinks: false }) },
            type: 'code',
          };
        }
      }
      // Header html
      else if (p.match(/^<h([0-6])>(.*)<\/h/)) {
        try {
          const match = p.match(/^<h([0-6])>(.*)<\/h/);
          const level = match[1];
          const text = match[2];
          block = { data: { text, level }, type: 'header' };
        } catch {
          block = {
            data: { code: parseBody(p, { secureLinks: false }) },
            type: 'code',
          };
        }
      }
      // image markdown
      else if (p.match(/^!\[(.*)\]\((.*)\)/)) {
        try {
          const match = p.match(/^!\[(.*)\]\((.*)\)/);
          const caption = match[1];
          const url = match[2];
          block = { data: { caption, file: { url } }, type: 'image' };
        } catch {
          block = {
            data: { code: parseBody(p, { secureLinks: false }) },
            type: 'code',
          };
        }
      }
      // image html
      else if (p.match(/^<img src="(.*?)"(?:| \/|\/)>/)) {
        try {
          const match = p.match(/^<img src="(.*?)"(?:| \/|\/)>/);
          const url = match[1];
          block = { data: { caption: '', file: { url } }, type: 'image' };
        } catch {
          block = {
            data: { code: parseBody(p, { secureLinks: false }) },
            type: 'code',
          };
        }
      }
      // image html with alt
      else if (p.match(/^<img alt="(.*?)" src="(.*?)"(?:| \/|\/)>/)) {
        try {
          const match = p.match(/^<img alt="(.*?)" src="(.*?)"(?:| \/|\/)>/);
          const caption = match[1];
          const url = match[2];
          block = { data: { caption, file: { url } }, type: 'image' };
        } catch {
          block = {
            data: { code: parseBody(p, { secureLinks: false }) },
            type: 'code',
          };
        }
      }
      // quote
      else if (p.match(/^> /)) {
        try {
          const text = p.replace(/^> /, '');
          block = { data: { text }, type: 'quote' };
        } catch {
          block = {
            data: { code: parseBody(p, { secureLinks: false }) },
            type: 'code',
          };
        }
      }
      // delimiter
      else if (p.match(/(?:^---|<hr>|<hr\/>|<hr \/>)/)) {
        block = { data: {}, type: 'delimiter' };
      }
      // embed
      else if (p.match(/^<iframe /)) {
        try {
          const match = p.match(/ src="(.*)"/);
          const embed = match[1];
          block = { data: { embed }, type: 'embed' };
        } catch {
          block = {
            data: { code: parseBody(p, { secureLinks: false }) },
            type: 'code',
          };
        }
      }
      // list
      // ordered list
      else if (p.match(/^1. /)) {
        try {
          const items = [];
          const list = `${p}\n`;
          list.match(/\d\. .*\n/g).forEach(m => {
            const match = m.match(/\d\. (.*)\n/);
            items.push(match[1]);
          });
          block = { data: { items, style: 'ordered' }, type: 'list' };
        } catch {
          block = {
            data: { code: parseBody(p, { secureLinks: false }) },
            type: 'code',
          };
        }
      }
      // unordered list with -
      else if (p.match(/^- /)) {
        try {
          const items = [];
          const list = `${p}\n`;
          list.match(/- .*\n/g).forEach(m => {
            const match = m.match(/- (.*)\n/);
            items.push(match[1]);
          });
          block = { data: { items, style: 'unordered' }, type: 'list' };
        } catch {
          block = {
            data: { code: parseBody(p, { secureLinks: false }) },
            type: 'code',
          };
        }
      }
      // unordered list with *
      else if (p.match(/^\* /)) {
        try {
          const items = [];
          const list = `${p}\n`;
          list.match(/\* .*\n/g).forEach(m => {
            const match = m.match(/\* (.*)\n/);
            items.push(match[1]);
          });
          block = { data: { items, style: 'unordered' }, type: 'list' };
        } catch {
          block = {
            data: { code: parseBody(p, { secureLinks: false }) },
            type: 'code',
          };
        }
      }
      // TODO: table
      // For comments: Parse to paragraph
      else if (useTextBlocks && p !== '') {
        block = {
          data: { text: parseBody(p, { secureLinks: false }) },
          type: 'paragraph',
        };
      }
      // else: HTML code block
      else if (p !== '') {
        block = {
          data: { code: parseBody(p, { secureLinks: false }) },
          type: 'code',
        };
      }
      if (block) json.blocks.push(block);
    });
    return { success: true, json };
  } catch (err) {
    console.warn(err);
    return { success: false };
  }
};

export default md2json;
