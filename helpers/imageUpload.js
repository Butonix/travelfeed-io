import { GraphQLClient } from 'graphql-request';
import Cookie from 'js-cookie';

const endpoint = 'http://localhost:4000/';

const authorization = Cookie.get('access_token');

const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization,
  },
});

const uploadFile = file => {
  // TODO: Resize image before uploading

  // Reject non-image files
  if (file.type.split('/')[0] !== 'image') return;

  const query = `{
    imageUploadLink(filename: "${file.name}", size: ${file.size}) {
      success
      uploadUrl
      fileName
    }
  }`;

  // eslint-disable-next-line consistent-return
  return graphQLClient.request(query).then(data => {
    if (!data || !data.imageUploadLink || !data.imageUploadLink.success) {
      return;
    }
    const { fileName, uploadUrl } = data.imageUploadLink;

    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl, true);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.send(file); // `file` is a File object here

    // eslint-disable-next-line consistent-return
    return new Promise(resolve => {
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) return;
        if (xhr.readyState === 4 && xhr.status === 200) {
          // File uploaded successfully
          resolve(`https://img.travelfeed.io/${fileName}`);
        }
      };
    });
  });
};

export default uploadFile;
