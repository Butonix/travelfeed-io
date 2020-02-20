import React from 'react';
import ReactImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { imageProxy } from '../../../helpers/getImage';

const ImageGallery = props => {
  const { images, isWebp } = props;
  const items = [];
  if (images && images.length > 0) {
    images.forEach(image => {
      items.push({
        original: imageProxy(
          image.url,
          1600,
          undefined,
          undefined,
          isWebp ? 'webp' : undefined,
        ),
        thumbnail: imageProxy(
          image.url,
          200,
          undefined,
          undefined,
          isWebp ? 'webp' : 'match',
        ),
      });
    });
  }
  return (
    <div className="fullwidth">
      <ReactImageGallery items={items} />
    </div>
  );
};

export default ImageGallery;
