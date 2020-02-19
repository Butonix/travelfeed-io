import React from 'react';
import ReactImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { imageProxy } from '../../../helpers/getImage';

const ImageGallery = props => {
  const { images } = props;
  const items = [];
  if (images && images.length > 0) {
    images.forEach(image => {
      items.push({
        original: imageProxy(image.url, 1000),
        thumbnail: imageProxy(image.url, 250),
      });
    });
  }
  return <ReactImageGallery items={items} />;
};

export default ImageGallery;
