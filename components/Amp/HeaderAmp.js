import Link from 'next/link';
import React from 'react';

const HeaderAmp = () => {
  return (
    <>
      <header className="ampstart-headerbar fixed flex justify-start items-center top-0 left-0 right-0 pl2 pr4 ">
        <div
          role="button"
          aria-label="open sidebar"
          on="tap:header-sidebar.toggle"
          tabIndex="0"
          className="ampstart-navbar-trigger  pr2  "
        >
          ☰
        </div>
        <div className="site-name">TravelFeed</div>
      </header>
      <amp-sidebar
        id="header-sidebar"
        className="ampstart-sidebar px3  "
        layout="nodisplay"
      >
        <div className="flex justify-start items-center ampstart-sidebar-header">
          <div
            role="button"
            aria-label="close sidebar"
            on="tap:header-sidebar.toggle"
            tabIndex="0"
            className="ampstart-navbar-trigger items-start"
          >
            ✕
          </div>
        </div>

        <ul className="ampstart-sidebar-faq list-reset m0">
          <li className="ampstart-faq-item">
            <Link href="/" className="text-decoration-none">
              <a>Home</a>
            </Link>
          </li>
          <li className="ampstart-faq-item">
            <Link href="/discover" className="text-decoration-none">
              <a>Discover</a>
            </Link>
          </li>
          <li className="ampstart-faq-item">
            <Link href="/destinations" className="text-decoration-none">
              <a>Destinations</a>
            </Link>
          </li>
          <li className="ampstart-faq-item">
            <Link href="/topics" className="text-decoration-none">
              <a>Topics</a>
            </Link>
          </li>
          <li className="ampstart-faq-item">
            <Link href="/map" className="text-decoration-none">
              <a>Map</a>
            </Link>
          </li>
        </ul>
      </amp-sidebar>
    </>
  );
};

export default HeaderAmp;
