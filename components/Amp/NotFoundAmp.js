import React from 'react';
import { imageProxy } from '../../helpers/getImage';
import Head from '../Header/Head';
import HeaderAmp from './HeaderAmp';
import StylesAmp from './StylesAmp';

const NotFoundAmp = () => {
  return (
    <>
      <Head
        title="404: Not Found | TravelFeed"
        noIndex
        scripts={
          <>
            <script async src="https://cdn.ampproject.org/v0.js" />
            <script
              async
              custom-element="amp-sidebar"
              src="https://cdn.ampproject.org/v0/amp-sidebar-0.1.js"
            />
          </>
        }
      />
      <HeaderAmp />
      <figure className="ampstart-image-fullpage-hero m0 relative mb4">
        <amp-img
          height="720"
          alt="desert"
          layout="fixed-height"
          src={imageProxy(
            'https://img.travelfeed.io/jpphotography%2F20190928T190403125Z-easysignup-2.jpg',
            undefined,
            720,
            'fit',
          )}
        />
        <div className="absolute top-0 right-0 bottom-0 left-0">
          <header className="p3">
            <h1 className="ampstart-fullpage-hero-heading mb3">
              <span className="ampstart-fullpage-hero-heading-text">
                404 - Not Found
              </span>
            </h1>
          </header>
        </div>
      </figure>
      <StylesAmp />
    </>
  );
};

export default NotFoundAmp;
