import React, { useCallback, useState } from 'react';
import Carousel, { Modal, ModalGateway } from 'react-images';
import Gallery from 'react-photo-gallery';
import { imageProxy } from 'tf-post-parser';

const MasonryImageGallery = props => {
  const { images, isWebp } = props;

  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const openLightbox = useCallback((event, { index }) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  const photos = [];
  if (images && images.length > 0) {
    images.forEach(image => {
      photos.push({
        src: imageProxy(
          image.url,
          1600,
          undefined,
          undefined,
          isWebp ? 'webp' : undefined,
        ),
        height: image.height,
        width: image.width,
      });
    });
  }

  return (
    <div className="fullwidth">
      <Gallery photos={photos} onClick={openLightbox} />
      <ModalGateway>
        {viewerIsOpen ? (
          <Modal onClose={closeLightbox}>
            <Carousel
              currentIndex={currentImage}
              views={photos.map(x => ({
                ...x,
                srcset: x.srcSet,
                caption: x.title,
              }))}
            />
          </Modal>
        ) : null}
      </ModalGateway>
    </div>
  );
};

export default MasonryImageGallery;
