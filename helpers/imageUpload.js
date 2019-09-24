import loadImage from 'blueimp-load-image';
import { GraphQLClient } from 'graphql-request';
import Cookie from 'js-cookie';

// prevent ssr problems due to missing window on server
let dataURLtoBlob;
const isWindow = typeof window !== 'undefined';
if (isWindow) dataURLtoBlob = require('blueimp-canvas-to-blob');

const endpoint = 'http://localhost:4000/';

const authorization = Cookie.get('access_token');

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization,
  },
});

const blobToFile = (theBlob, fileName) => {
  // https://stackoverflow.com/questions/27159179/how-to-convert-blob-to-file-in-javascript
  // A Blob() is almost a File() - it's just missing the two properties below which we will add
  theBlob.lastModifiedDate = new Date();
  theBlob.name = fileName;
  return theBlob;
};

const upload = file => {
  // Reject non-image files
  if (file.type.split('/')[0] !== 'image') return;

  // eslint-disable-next-line consistent-return
  return new Promise(resolve => {
    const query = `{
    imageUploadLink(filename: "${file.name}", size: ${file.size}) {
      success
      uploadUrl
      fileName
    }
  }`;

    // eslint-disable-next-line consistent-return
    graphQLClient.request(query).then(data => {
      if (!data || !data.imageUploadLink || !data.imageUploadLink.success) {
        return;
      }
      const { fileName, uploadUrl } = data.imageUploadLink;

      const xhr = new XMLHttpRequest();
      xhr.open('PUT', uploadUrl, true);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file); // `file` is a File object here

      // eslint-disable-next-line consistent-return
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          // File uploaded successfully
          resolve(`https://img.travelfeed.io/${encodeURIComponent(fileName)}`);
        }
      };
    });
  });
};

const uploadFile = async localfile => {
  return new Promise((resolve, reject) => {
    if (localfile.size < 1000000 || localfile.type === 'image/gif') {
      // Upload files under 1MB directly. Also don't resize gifs since that would break animations
      upload(localfile)
        .then(result => {
          resolve(result);
        })
        .catch(() => reject(new Error('Image could not be uploaded')));
    } else {
      // Resize large images before uploading
      const canvasId = 'hiddenResizeCanvas';
      const imgId = 'hiddenUploadedImage';
      loadImage(
        localfile,
        async resimg => {
          resimg.id = imgId;
          resimg.style.display = 'none'; // Make sure the image is hidden
          document.body.appendChild(resimg);
          const img = document.getElementById(imgId);
          const { height, width } = img;
          const canvas = document.createElement('canvas'); // Dynamically Create a Canvas Element
          canvas.id = canvasId; // Give the canvas an id
          canvas.width = width; // Set the width of the Canvas
          canvas.height = height; // Set the height of the Canvas
          canvas.style.display = 'none'; // Make sure your Canvas is hidden
          document.body.appendChild(canvas); // Insert the canvas into your page
          const c = document.getElementById(canvasId); // Get canvas from page
          const ctx = c.getContext('2d'); // Get the "CTX" of the canvas
          ctx.drawImage(img, 0, 0, width, height); // Draw your image to the canvas
          const durl = c.toDataURL(localfile.type); // This will save your image as a
          const blob = await dataURLtoBlob(durl);
          // jpeg file in the base64 format.
          const resfile = await blobToFile(blob, localfile.name);
          c.parentNode.removeChild(c);
          img.parentNode.removeChild(img);

          upload(resfile)
            .then(result => {
              resolve(result);
            })
            .catch(() => reject(new Error('Image could not be uploaded')));
        },
        { maxWidth: 1920 },
      );
    }
  });
};

export default uploadFile;
