import React from 'react';
import { imageProxy } from '../../helpers/getImage';

const AmpImageGallery = props => {
  const { images, isWebp } = props;
  const items = [];
  if (images && images.length > 0) {
    images.forEach(image => {
      items.push({
        original: imageProxy(
          image.url,
          1200,
          undefined,
          undefined,
          isWebp ? 'webp' : undefined,
        ),
        thumbnail: imageProxy(
          image.url,
          60,
          40,
          undefined,
          isWebp ? 'webp' : 'match',
        ),
      });
    });
  }

  return (
    <>
      <amp-carousel
        id="carousel"
        width="400"
        height="300"
        layout="responsive"
        type="slides"
        on="slideChange:
              carouselSelector.toggle(index=event.index, value=true),
              carouselPreview.goToSlide(index=event.index)
      "
        lightbox=""
      >
        {items.map(({ original }, i) => (
          <amp-img
            src={original}
            layout="fill"
            alt={`Full gallery image ${i + 1}`}
          />
        ))}
      </amp-carousel>
      <amp-selector
        id="carouselSelector"
        on="select:carousel.goToSlide(index=event.targetOption)"
        layout="container"
      >
        <amp-carousel
          id="carouselPreview"
          class="carousel-preview"
          height="60"
          layout="fixed-height"
          type="carousel"
        >
          {items.map(({ thumbnail }, i) => (
            <amp-img
              option={`${i}`}
              selected={i === 0 ? '' : undefined}
              src={thumbnail}
              width="60"
              height="40"
              alt={`Galery thumbnail ${i + 1}`}
            />
          ))}
        </amp-carousel>
      </amp-selector>
    </>
  );
};

export default AmpImageGallery;
