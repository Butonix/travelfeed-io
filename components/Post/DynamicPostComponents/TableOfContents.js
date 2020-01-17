/* eslint-disable prefer-destructuring */
import React from 'react';
import getSlug from 'speakingurl';

const TableOfContents = props => {
  const { headings } = props;

  if (!headings || headings.length < 1) return <></>;

  return (
    <>
      <div className="toc">
        <div className="toc-header">Table of Contents</div>
        <ul className="toc-list">
          {headings.map(heading => {
            return (
              <li>
                <a href={`#${getSlug(heading.title)}`}>
                  <span className="toc-text">{heading.title}</span>
                </a>
                {heading.subheadings.length > 0 && (
                  <ul className="toc-list-l2">
                    {heading.subheadings.map(subheading => {
                      return (
                        <li>
                          <a href={`#${getSlug(subheading.title)}`}>
                            <span className="toc-text">{subheading.title}</span>
                          </a>
                          {subheading.subheadings.length > 0 && (
                            <ul className="toc-list-l3">
                              {subheading.subheadings.map(sh => {
                                return (
                                  <li>
                                    <a href={`#${getSlug(sh.title)}`}>
                                      <span className="toc-text">
                                        {sh.title}
                                      </span>
                                    </a>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <style jsx global>{`
        .toc {
          padding: 40px;
          box-shadow: 1px 0px 1px 0px rgba(0, 0, 0, 0.2),
            0px 1px 1px 0px rgba(193, 193, 193, 0.14),
            0px 1px 1px -1px rgba(0, 0, 0, 0.12),
            0 -1px 1px -1px rgba(0, 0, 0, 0.2);
          display: table;
          width: calc(100% + 48px);
          max-width: calc(100% + 48px);
          margin: 20px -24px 20px -24px;
          background-color: #c1dbd9;
          box-sizing: border-box;
        }

        .toc-header {
          font-weight: bold;
          text-align: left;
          font-size: 40px;
          color: #03695d;
          line-height: 100%;
          text-transform: uppercase;
          margin: 0 0 25px;
        }

        .toc-list {
          column-gap: 15px;
          list-style: none;
          padding: 0 0 0 0;
          font-size: 18px;
          margin: 0;
        }

        @media (max-width: 576px) {
          .toc-list {
            columns: 1;
          }
        }
        @media (min-width: 577px) {
          .toc-list {
            columns: 2;
          }
        }
        @media (min-width: 1200px) {
          .toc-list {
            columns: 3;
          }
        }

        .toc ul {
          counter-reset: item;
        }
        .toc-list li {
          padding: 3px 0 3px 0;
          margin: 0;
          counter-increment: item;
          position: relative;
          line-height: normal;
        }
        .toc-list li a:before {
          display: table-cell;
          content: counters(item, '.');
          color: #03695d;
          font-weight: bold;
          padding-right: 10px;
          font-size: 18px;
          white-space: nowrap;
        }
        .toc-list li a:hover {
          color: #394aab;
        }
        .toc-list li a,
        .toc-list li a:hover {
          text-decoration: none;
        }
        .toc-list li .toc-list-l2,
        .toc-list li .toc-list-l3 {
          list-style: none;
          margin: 0;
          padding-left: 20px;
        }
        .toc .toc-list li a .toc-text {
          display: table-cell;
          font-size: 18px;
        }
      `}</style>
    </>
  );
};

export default TableOfContents;
