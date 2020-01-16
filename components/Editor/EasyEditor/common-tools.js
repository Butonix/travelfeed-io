import CodeTool from '@editorjs/code';
import Delimiter from '@editorjs/delimiter';
import Header from '@editorjs/header';
import Image from '@editorjs/image';
import LinkTool from '@editorjs/link';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Table from '@editorjs/table';
import { API_URL } from '../../../config';
import uploadFile from '../../../helpers/imageUpload';
import Embed from './tools/embed/index';
import Quote from './tools/quote/index';
import tableOfContents from './tools/tableOfContents/index';

// TODO: Write maps embed plugin
// TODO: Write gallery plugin

export default {
  header: Header,
  delimiter: Delimiter,
  tableOfContents,
  list: List,
  linkTool: {
    class: LinkTool,
    config: {
      endpoint: `${API_URL}/fetchUrl`, // Your backend endpoint for url data fetching
    },
  },
  code: {
    class: CodeTool,
    config: {
      placeholder: 'Enter HTML or Markdown here',
    },
  },
  image: {
    class: Image,
    config: {
      // https://github.com/editor-js/image
      uploader: {
        uploadByFile(file) {
          return uploadFile(file, {}).then(res => {
            return new Promise(resolve => {
              resolve({
                success: 1,
                file: res,
              });
            });
          });
        },
        uploadByUrl(file) {
          return new Promise(resolve => {
            resolve({
              success: 1,
              file: {
                url: file,
              },
            });
          });
        },
      },
    },
  },
  embed: {
    class: Embed,
    config: {
      // https://github.com/editor-js/embed
      services: {
        youtube: true,
        vimeo: true,
        twitchVideo: true,
        dtubeID: {
          // Dtube from url
          // regex: https://github.com/steemit/condenser/blob/fd58e1d526925e048e44ea19d6d91e11a157235e/src/app/utils/Links.js
          // eslint-disable-next-line no-useless-escape
          regex: /(?:d\.tube\/#!\/(?:v\/)?([a-zA-Z0-9\-\.\/]*))+/,
          embedUrl: 'https://emb.d.tube/#!/<%= remote_id %>',
          html:
            "<iframe height='300' scrolling='no' frameborder='0' allowtransparency='true' allowfullscreen style='width: 100%;'></iframe>",
        },
        dtube: {
          // Dtube embed snippet
          // regex: https://github.com/steemit/condenser/blob/fd58e1d526925e048e44ea19d6d91e11a157235e/src/app/utils/Links.js
          // eslint-disable-next-line no-useless-escape
          regex: /https:\/\/(?:emb\.)?(?:d.tube\/\#\!\/(?:v\/)?)([a-zA-Z0-9\-\.\/]*)/,
          embedUrl: 'https://emb.d.tube/#!/<%= remote_id %>',
          html:
            "<iframe height='300' scrolling='no' frameborder='0' allowtransparency='true' allowfullscreen style='width: 100%;'></iframe>",
        },
        instagram: {
          // Regex for instagram: https://stackoverflow.com/questions/40054016/regex-to-get-instagram-picture-php
          // Instagram iFrame edit for editor preview: https://stackoverflow.com/questions/24739663/embebing-instagram-webpage-inside-an-iframe
          regex: /(?:http[s]?:\/\/)?(?:www.)?instagram\.com\/p\/(.*)\//,
          embedUrl: 'https://instagram.com/p/<%= remote_id %>/embed',
          html:
            "<iframe height='400' frameborder='0' style='width: 50%; margin: 0 auto; display: block;'></iframe>",
        },
      },
    },
  },
  quote: Quote,
  table: {
    class: Table,
    inlineToolbar: true,
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
};
