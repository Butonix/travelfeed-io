/* eslint-disable import/prefer-default-export */
import gql from 'graphql-tag';

export const IMAGE_UPLOAD_LINK = gql`
  query imageUploadLink($filename: String!, $size: Int!) {
    imageUploadLink(filename: $filename, size: $size) {
      success
      uploadUrl
      fileName
    }
  }
`;
