/* eslint-disable prefer-destructuring */
import React from 'react';
import getSlug from 'speakingurl';

require('./TableOfContents.css');

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
    </>
  );
};

export default TableOfContents;
